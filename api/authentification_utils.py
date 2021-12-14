import uuid
from .models import Token

# check valid of token
def check_auth(token):
    if token is None:
        return False
    same_tokens = Token.objects.filter(token=token)
    if len(same_tokens) == 0:
        return None
    return True

# generate new unique token
def generate_new_token():
    new_token = str(uuid.uuid4())
    same_tokens = Token.objects.filter(token=new_token)
    if len(same_tokens) > 0:
        return generate_new_token()
    else:
        tokenInstance = Token(token=new_token)
        tokenInstance.save()
        return new_token