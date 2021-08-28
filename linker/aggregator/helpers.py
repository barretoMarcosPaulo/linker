
def format_users_list_result(users):
    datas = []
    for user in users:
        datas.append(
            {
                "name": user[1],
                "username": user[0],
                "id": user[2],
            }
        )
    return datas