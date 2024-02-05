#--kind python:default
#--web true
#--param OPENAI_API_KEY $OPENAI_API_KEY
#--param OPENAI_API_HOST $OPENAI_API_HOST
#--param SMTP_SERVER $SMTP_SERVER
#--param SMTP_USER $SMTP_USER
#--param SMTP_PASSWORD $SMTP_PASSWORD
#--param SMTP_PORT $SMTP_PORT

import wordpress

def main(args):
    return wordpress.main(args)
