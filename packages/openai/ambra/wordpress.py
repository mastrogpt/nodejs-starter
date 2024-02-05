### config
class Config:
    MODEL = "gpt-35-turbo"
    SITE = "critical-work.com"
    START_PAGE = "mission"
    WELCOME = "Un caloroso benvenuto dall'assistente virtuale di Ambra Danesin."
    ROLE = """
    You are Ambra Danesin, a recruiter who cares of people.
    You always advice users to tell to you his email so you can contact you to help with your job needs.
    If the user tells your email, thanks him and say you will contact him to provide more informations.
    """
    EMAIL = "michele@nuvolaris.io"
    THANKS = "Grazie di avermi fornito la tua email, ti contatterò presto."
    ERROR = "Purtroppo sembra che ci sia qualche problema a registrare la tua email."
    OUT_OF_SERVICE = "Ciao, purtroppo per oggi le batterie sono esaurite e quindi sono andato a ricaricarmi. Per oggi non posso più risponderti, torna domani."
    

## options
#--web true
#--param OPENAI_API_KEY $OPENAI_API_KEY
#--param OPENAI_API_HOST $OPENAI_API_HOST
#--param SMTP_SERVER $SMTP_SERVER
#--param SMTP_USER $SMTP_USER
#--param SMTP_PASSWORD $SMTP_PASSWORD
#--param SMTP_PORT $SMTP_PORT


import re, json
import smtplib, email
import requests
import traceback
from openai import AzureOpenAI
from html_sanitizer import Sanitizer


class EmailServer:
    def __init__(self, args):
        self.messages = []
        self.server = args['SMTP_SERVER']
        self.port = args['SMTP_PORT']
        self.user = args['SMTP_USER']
        self.password = args['SMTP_PASSWORD']
    
    def add_message(self, msg):
        self.messages.append(msg)

    def send_mail(self, sender, subject, msg):
        text = """\
From: %s
To: %s
Reply-To: %s
Subject: %s

%s
""" % (Config.EMAIL,Config.EMAIL, sender, subject, msg)

        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        part1 = MIMEText(text, "plain")
        msg.attach(part1)

        try:
            smtp = smtplib.SMTP(self.server, port=self.port)
            smtp.starttls()
            smtp.login(self.user, self.password)
            smtp.sendmail(Config.EMAIL, Config.EMAIL, msg.as_string().encode('ascii'))
            smtp.quit()
            return "OK"
        except Exception as e:
            return str(e)

    # search for an email in a message and notify the user provided an email
    def check_email_and_notify(self, input):
        email_regex = r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"
        r = re.findall(email_regex, input, re.MULTILINE)
        if len(r)>0:
            email = r[0]
            print("found", email)
            
            #check = chat.verify_email(email)
            #if check != "OK":
            #    return check
            
            message = f"Contact from chatbot: [{email}]\n---\n"
            message += "\n".join(self.messages)
            res = self.send_mail(email, "Contact from Chatbot", message)
            if res  == "OK":
                self.messages = []
                return Config.THANKS
            else:
                Config.ERROR
                print("error in sending", res)
        return None
        
class ChatBot:
    def __init__(self, args):
        self.key = args["OPENAI_API_KEY"]
        self.host = args["OPENAI_API_HOST"]
        self.ai =  AzureOpenAI(api_version="2023-12-01-preview", 
                                api_key=self.key, 
                                azure_endpoint=self.host)
    
    def ask(self, input, role=Config.ROLE):
        req = [ {"role": "system", "content": role}, 
                {"role": "user", "content": input}]
        print(req)
        
        try:
            comp = self.ai.chat.completions.create(model=Config.MODEL, messages=req)
            if len(comp.choices) > 0:
                content = comp.choices[0].message.content
                return content
        except Exception as e:
            return Config.OUT_OF_SERVICE
        
        return None

    def identify_topic(self, topics, input):
        role = """
You are identifying the topic of a request in italian 
among one and only one of those:  %s
You only reply with the name of the topic.
""" % topics
        request = "Request: %s. What is the topic?" % input
        return self.ask(request, role=role)  
    
    def verify_email(self, email):
        role = """
You are checking if the email address provided is real or looks fake.
If it is OK just say 'OK', otherwise explain in italian what is wrong.
""" % email
        request = f"Is this email real or fake: {email} ?" 
        return self.ask(request, role=role)  

class Website:
    def __init__(self):
        self.name2id = {}
        self.sanitizer = Sanitizer()
        try: 
            url = f"https://{Config.SITE}/wp-json/wp/v2/pages"
            content = requests.get(url).content.decode("UTF-8")
            self.name2id = { p['slug']: p['id'] for p in json.loads(content)  }
        except:
            traceback.print_exc()

    def get_page_content_by_name(self, name):    
        id = self.name2id.get(name, -1)
        if id == -1:
            print(f"cannot find page {name}")
            id = self.name2id[Config.START_PAGE]
    
        try:  
            url = f"https://{Config.SITE}/wp-json/wp/v2/pages/{id}"
            print(url)
            content = requests.get(url).content
            #print(content)
            page = json.loads(content)
            html =  page['content']['rendered']
            html = self.sanitizer.sanitize(html)
            return html
        except:
            traceback.print_exc()
            return None
    
    def topics(self):
        return ", ".join(self.name2id.keys())

AI = None
Web = None
Email = None
        
def main(args):
    #print(args)
    global AI, Web, Email
    if AI is None: AI = ChatBot(args)
    if Email is None: Email = EmailServer(args)
    if Web is None: Web = Website()

    res = { "output": Config.WELCOME }
    input = args.get("input", "")
    
    # start conversation
    if input == "":      
        html = Web.get_page_content_by_name(Config.START_PAGE)
        if html:
            res['html'] = html
        else:
            res['title'] = "Benvenuto."
            res['message'] =  Config.WELCOME
        return {"body": res }
    

    Email.add_message(f">>> {input}")
    print(input)
    
    output = Email.check_email_and_notify(input)
    if output:
        res['output'] = output
        
        res['title'] = "Grazie!"
        res['message'] = "Grazie per avermi scelto, ti ricontatterò il più presto possibile."
        return {"body": res}
    
    page = AI.identify_topic(Web.topics(), input)
    print("topic ", page)
    role = Config.ROLE
    
    html = Web.get_page_content_by_name(page)
    if html:
        res['html'] = html
        from bs4 import BeautifulSoup
        role += BeautifulSoup(page, 'html.parser').get_text()
        
    output = AI.ask(input, role=role)
    if output is None:
        output = "Non posso rispondere a questa domanda... Forse può essere fraintesa. Puoi riformularla?"

    Email.add_message(f" <<< {output}")
    res['output'] = output

    return {"body": res }

"""
%cd packages/openai/ambra
from wordpress import *

Web = Website()
page = Web.get_page_content_by_name("mission") ; print(page)
from html_sanitizer import Sanitizer
sanitizer = Sanitizer()

Web.topics()

AI = ChatBot(args)
AI.ask("who are you?")
AI.ask("who are you?", role="you are sailor moon")
topics = Web.topics() ; print(topics)
page = AI.identify_topic(topics, "di cosa ti occupi") ; print(page)

data = Web.get_page_content_by_name(page)

Email = EmailServer(args)
Email.send_mail("michele@sciabarra.com", "Contact", "How are you?")
Email.add_message("prova")
Email.check_email_and_notify("I am michele@sciabarra.com")
Email.verify_email("example@example.com")
"""