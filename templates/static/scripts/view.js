
const ViewFunctions = {
    
    disableElementMenu:{
        "friends":"workspaces",
        "workspaces":"friends",
    },

    removeSelectedItem(){
        let selected = document.querySelectorAll(
            '.card-option-select.selected'
        );
        selected[0].classList.remove('selected');
    },

    selectItem(element){
        this.removeSelectedItem();
        element.classList.add("selected");
        this.setOptionVisible(element);
    },

    setOptionVisible(element){
        const option_visible = element.getAttribute('data-option');
        const option_hidden = this.disableElementMenu[option_visible];
        
        document.getElementById(option_visible).classList.remove('hidden')
        document.getElementById(option_hidden).classList.add('hidden')
    },

    setFriendInfos(name, id){
        document.getElementById('user-name-remove-1').textContent = name
        document.getElementById('user-name-remove-2').textContent = name
    },

    setSpaceModalInfos(name, id){
        document.getElementById('workspace-name').textContent = name
        document.getElementById('workspace-name2').textContent = name
    },
    
    mountListFriends(friends){
        const rootElement = document.getElementById('friends_content');
        rootElement.innerHTML = " ";
        for(let key in friends){
            this.createFriendCard(
                rootElement,
                friends[key].friend_name,
                friends[key].friend_username,
                friends[key].friendship_id
            );
        }

    },

    createFriendCard(root, name, username, id_friendship){
        const template = `
        
            <div class="card-item" id="${id_friendship}">
                <div class="col-md-11">
                    <label style="color: white">
                        <i class="fas fa-user"></i> ${name}
                        <small>(${username})</small>
                    </label>
                </div>

                <div class="icon-remove" 
                    title="Remover amizade" 
                    onclick="removeFriendModal('${name}', '${id_friendship}')">
                    <i class="far fa-times-circle"></i>
                </div>
            </div>
        
        `
        root.insertAdjacentHTML("beforeend", template);
    },
    

    mountListSpaces(workspaces){

        const rootElement = document.getElementById('workspaces_content');
        rootElement.innerHTML = "";
        for(let key in workspaces){
            this.createWorkspaceCard(
                rootElement,
                workspaces[key].name,
                workspaces[key].id,
            );
        }
    },


    createWorkspaceCard(root, name, id){
        template = `
            <div class="card-item" id="workspace-${id}">
                <div class="col-md-11">
                    <a onclick="showSpaceSelected('${id}')" style="cursor:pointer">
                        <i class="fas fa-cube"></i> ${name}
                    </a>
                </div>

                <div 
                    class="icon-remove" 
                    title="Remover WorkSpace"
                    onclick="removeSpaceModal('${name}', '${id}')"
                >
                    <i class="far fa-times-circle"></i>
                </div>
            </div>
        `
        root.insertAdjacentHTML("beforeend", template);
    },


    hiddenElement(id){
        document.getElementById(id).style = "display:none;"
    },


    mountUsersAutocomplete(root, values){
        const mainElement = document.getElementById(root);
        mainElement.innerHTML = '';

        if(values.length == 0){

        let template = `
            <div class="text-center">
                <label>Sem resultados encontrados</label>
            </div>
        `
        mainElement.insertAdjacentHTML("beforeend", template);

        }else{

            values.forEach((element)=>{
                let template = `
                    <div onClick="setUserSelected('${element.name}','${element.username}','${element.id}',)" >
                        <label>${element.name}(${element.username})</label>
                    </div>
                `
                mainElement.insertAdjacentHTML("beforeend", template);
            })

        }

    },

    mountFriendsAutocomplete(root, values){
        const mainElement = document.getElementById(root);
        mainElement.innerHTML = '';

        if(values.length == 0){

        let template = `
            <div class="text-center">
                <label>Sem resultados encontrados</label>
            </div>
        `
        mainElement.insertAdjacentHTML("beforeend", template);

        }else{

            values.forEach((element)=>{
                let template = `
                    <div onClick="addFriendList('${element.name}','${element.username}','${element.id}')" >
                        <label>${element.name}(${element.username})</label>
                    </div>
                `
                mainElement.insertAdjacentHTML("beforeend", template);
            })

        }

    },

    mountFriendsSpaceAutocomplete(root, values){
       console.log(root)
        const mainElement = document.getElementById(root);
        mainElement.innerHTML = '';

        if(values.length == 0){

        let template = `
            <div class="text-center">
                <label>Sem resultados encontrados</label>
            </div>
        `
        mainElement.insertAdjacentHTML("beforeend", template);

        }else{

            values.forEach((element)=>{
                let template = `
                    <div onClick="addFriendSpace('${element.name}','${element.username}','${element.id}')" >
                        <label>${element.name}(${element.username})</label>
                    </div>
                `
                mainElement.insertAdjacentHTML("beforeend", template);
            })

        }

    },

    createCardFriendShare(root, id, username){

        template = `
            <div class="friend-share-card" id="friendShare${id}" data-id="${id}">
                <i class="fas fa-times" onclick="deleteFriendShare('friendShare${id}')"></i>
                <label>${username}</label>
            </div>
        `
        root.insertAdjacentHTML("beforeend", template);
    },


    sendRequestFriendship(){
        let hidden = document.querySelectorAll('.info')
        hidden.forEach((el)=>{
            el.style = "display: none"
        })

        const modal = document.getElementById("modal-body-friendship");
        let template = `
            <div class="text-center alert alert-success" id="message-request-friendship">
                <i class="far fa-thumbs-up"></i>
                <label>Pedido de amizade enviado com sucesso!</label>
            </div>
        `
        modal.insertAdjacentHTML("beforeend", template);

    },


    mountListTags(tags, element){

        const rootElement = document.getElementById(element);
        rootElement.innerHTML = "";
        for(let key in tags){
            this.createTagCard(
                rootElement,
                tags[key].name,
                tags[key].id,
            );
        }
    },


    createTagCard(root, name, id){
        if(root.id == "tags-content-space"){

            template = `
            <div class="default-tag-link" id='${id}'>
                <label>${name}</label>
            </div>
            `

        }else{

            if(root.id == "tags-content"){
                template = `
                    <div class="default-tag" id='${id}' onclick="filterByTag(this)">
                        <label>${name}</label>
                    </div>
                `
            }else{
                template = `
                <div class="default-tag-link" id='${id}' onclick="selectTag(this)">
                    <label>${name}</label>
                </div>
                `
            }

        }


        root.insertAdjacentHTML("beforeend", template);
    },

    mountListLinks(links, element){
        const rootElement = document.getElementById(element);
        rootElement.innerHTML = "";
        for(let key in links){
            this.createLinkCard(rootElement, links[key]);
        }
    },
    createLinkCard(root, link){
        const template = `
            <div class="card-link-list">

                <div class="link-content" id='${link.id}'>
                    <h3>${link.title}</h3>
                    <p class="description_link">${link.description}</p>
                    <div>
                        <p class="tags-link-list">${link.tags}</p>
                    </div>
                    <p class="shared-by">${link.created_by}</p>
                </div>
            


                <div class="link-options">
                    


                    <div onclick="openLinkNewTab('${link.url}')">
                        <label>
                            <i class="fas fa-external-link-alt"></i>
                        </label>
                        <p>Abrir link</p>
                    </div>

                    <div style="${link.shared ? 'display:none': "" }" onclick="shareLink('${link.title}','${link.id}')">
                        <label>
                            <i class="far fa-paper-plane"></i>
                        </label>
                        <p>Compartilhar</p>
                    </div>

                    <div class="btn-delete" onclick="deleteLink('${link.id}','${link.shared}')">
                        <label>
                            <i class="fas fa-trash-alt"></i>
                        </label>
                        <p class="btn-delete-text">Excluir</p>
                    </div>
                </div>
            </div>
        
        `
        root.insertAdjacentHTML("beforeend", template);
    },

    mountListLinksSpaces(links, element){
        const rootElement = document.getElementById(element);
        rootElement.innerHTML = "";
        for(let key in links){
            this.createLinkCardSpaces(rootElement, links[key]);
        }
    },
    createLinkCardSpaces(root, link){
        const template = `
            <div class="card-link-list">

                <div class="link-content" id='${link.id}'>
                    <h3>${link.title}</h3>
                    <p class="description_link">${link.description}</p>
                </div>
            


                <div class="link-options">
                    
                    <div onclick="openLinkNewTab('${link.url}')">
                        <label>
                            <i class="fas fa-external-link-alt"></i>
                        </label>
                        <p>Abrir link</p>
                    </div>

                    <div class="btn-delete" onclick="deleteLink('${link.id}','${false}')">
                        <label>
                            <i class="fas fa-trash-alt"></i>
                        </label>
                        <p class="btn-delete-text">Excluir</p>
                    </div>
                </div>
            </div>
        
        `
        root.insertAdjacentHTML("beforeend", template);
    },



    mountListNotifications(element, notifications){

        const rootElement = document.getElementById(element);
        rootElement.innerHTML = "";
        for(let key in notifications){
            console.log(notifications[key])
            this.createTemplateNotification(
                rootElement,
                notifications[key].send_by,
                notifications[key].id,
            );
        }
    },


    createTemplateNotification(root, name, id){
        template = `
            <div style="display:block" class="card-friend-request" id="notification-${id}">
                    
                <label>
                    ${name}
                </label>
                
                <div class="btn-list-options">
                
                <a style="color:white" class="btn-accept" onClick="readNotification('accept', '${id}')">
                    Aceitar
                </a>

                <a style="color:white" class="btn-reject" onClick="readNotification('reject', '${id}')">
                    Rejeitar
                </a>

                </div>

            </div>
        `
        root.insertAdjacentHTML("beforeend", template);
    },


}
