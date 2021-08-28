from linker.accounts.models import User
from unidecode import unidecode
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent

def read_file(relative_dir):
    absolute_dir = os.path.join(BASE_DIR, relative_dir)
    
    with open(absolute_dir) as file:
        lines = file.readlines()
        return lines
    return None


def read_list(names):
    for name in names:
        username = create_username(name)
        email = username+"@gmail.com"
        name = name.replace('\n', '')
        create_users_on_db(username, name, email)


def create_users_on_db(name, username, email):
    try:
        print("Criando ", name)
        user = User.objects.create(
            username=username,
            full_name=name,
            email=email
        )
        user.set_password("senha@teste")
    except Exception as error:
        print("[Error- {} ] - {}".format(name, error) )

def create_username(name):
    username = unidecode(name.lower())
    username = username.replace(
        ' ', ''
    ).replace('\n','')
    return username


def main():
    names = read_file("names.txt")
    read_list(names)
main()