const NetworkFuncions = {
    
    get_csrf_token(){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken');
        return csrftoken[0].value;
    },

    async post_request(url, datas){
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(datas),
            credentials: 'include',
            headers: new Headers({
              'X-CSRFToken': this.get_csrf_token(),
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            })
        })
        return response;
    },

    async get_request(url){

        const response = await fetch(url, {
            method: "GET",
            credentials: 'include',
            headers: new Headers({
              'X-CSRFToken': this.get_csrf_token(),
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            })
        })
        return response;

    },

    async request(method, url, datas){
        let response = undefined;

        if(method == "GET"){
            response  = await this.get_request(url)
        }else{
            response  = await this.post_request(url, datas);
        }
        return response;
    },

    async get_friends_list(){
        const response = await this.request("GET", "./amigos/");
        const datas = await response.json();
        return datas.friendships;
    },

    async removeFriendship(datas){
        const response = await this.request("POST", "./amigos/remover/", datas);
        return response
    },

    async get_workspaces_list(){
        const response = await this.request("GET", "./workspaces/");
        const datas = await response.json();
        return datas.workspaces;
    },

    async searchUser(name, friendsOnly){
        let url = `./usuarios/autocomplete/?nome=${name}&friendsOnly=${friendsOnly}`;
        const response = await this.request("GET", url);
        const datas = await response.json();
        return datas.users;
    },

    async requestFriendship(user){
        const response = this.request(
            "POST", "./usuarios/amizade/", {"user":user}
        );
    },
    async removeWorkspace(datas){
        const response = await this.request(
            "POST", "./workspaces/remover/", datas
        );
        return response;
    },
    async addNewSpace(datas){
        const response = await this.request(
            "POST", "./workspaces/novo/", datas
        );
        return response;
    },
    async addNewTag(datas){
        const response = await this.request(
            "POST", "./tags/", datas
        );
        return response;
    },

    async addNewLink(datas){
        const response = await this.request(
            "POST", "./links/", datas
        );
        return response;
    },

    async get_tags_list(){
        const response = await this.request("GET", "./tags/");
        const datas = await response.json();
        return datas.tags
    },

    async get_links_list(){
        const response = await this.request("GET", "./links/");
        const datas = await response.json();
        return datas.links
    },

    async send_link_shared(datas){
      
        const response = await this.request(
            "POST", "./compartilhar/", datas
        );
        return response;

    },

    async get_user_channel(){
        const response = await this.request("GET", "../usuarios/channels");
        const datas = await response.json();
        return datas.channel
    },

    async get_user_notifications(){
        const response = await this.request("GET", "./notificacoes/");
        const datas = await response.json();
        return datas.notifications;
    },

    async readNotification(datas){
        const response = await this.request(
            "POST", "./notificacoes/", datas
        );
        return response;
    },

    async linkDelete(datas){
        const response = await this.request(
            "POST", "./links/delete/", datas
        );
        return response;
    },
    async workSpaceDetails(datas){
        const response = await this.request(
            "POST", "./workspaces/", datas
        );
        const datas_response = await response.json();
        return datas_response.results;
    },

    async searchLinks(datas){
        const response = await this.request(
            "POST", "./links/buscar/", datas
        );

        const datas_response = await response.json();
        return datas_response.links;
    },

}