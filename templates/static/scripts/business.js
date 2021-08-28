const UI = ViewFunctions;
const Network = NetworkFuncions;
const SUCCESS_STATUS = 200;

function selectItem(element){
    UI.selectItem(element);
    document.getElementById('content').style="";
    document.getElementById('content-spaces').style="display:none";
}   

function removeFriendModal(userName, friendship_id){
    UI.setFriendInfos(userName, friendship_id);
    document.getElementById('btnRemoveFriend').setAttribute(
        "data-id",
        friendship_id
    )
    $('#removeFriend').modal('show');
}


async function removeFriendship(element){
    const id_friendship = element.getAttribute('data-id');
    const response = await Network.removeFriendship( 
        {"id" : id_friendship} 
    );
    
    if(response.status == SUCCESS_STATUS){
        UI.hiddenElement(id_friendship);
        $('#removeFriend').modal('hide');

    }
}

function addFriendModal(){
    resetModalFriend();
    $('#addFriend').modal('show');
}
function resetModalFriend(){

    let hidden = document.querySelectorAll('.info')
    hidden.forEach((el)=>{
        el.style = "border:none"
    })

    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = " ";
    let inputUser = document.getElementById('user-selected');
    inputUser.value = "";

    try{
        const message = document.getElementById("message-request-friendship");
        message.remove();
    }catch(e){}
}

async function addNewFriend(){
    let input = document.getElementById('user-selected');
    const user = input.getAttribute('data-id');
    UI.sendRequestFriendship();
    const response = await Network.requestFriendship(user);
}


function addWorkspaceModal(){
    document.getElementById('list-friends-space').innerHTML = ""
    document.getElementById('autocomplete-list-space').innerHTML = ""
    
    document.getElementById('new-workspace').value = ""
    document.getElementById('friend-selected-space').value = ""

    $('#addWorkspace').modal('show');
}
async function addNewWorkspace(){
    let workspace = document.getElementById('new-workspace');
    const users = [];

    document.querySelectorAll('.friend-share-card').forEach((el)=>{
        users.push(el.getAttribute('data-id'))
    })

    const response = await Network.addNewSpace({"name":workspace.value, "users":users});
    if(response.status == SUCCESS_STATUS){
        this.initWorkSpacesList();
        $('#addWorkspace').modal('hide');
    }
    
}

function removeSpaceModal(name, id){
    UI.setSpaceModalInfos(name, id);
    document.getElementById('btnRemoveSpace').setAttribute(
        "data-id",
        id
    )
    $('#removeSpace').modal('show');
}

async function removeSpace(element){
    const id = element.getAttribute('data-id');
    const response = await Network.removeWorkspace( 
        {"id" : id} 
    );
    
    if(response.status == SUCCESS_STATUS){
        UI.hiddenElement(`workspace-${id}`);
        $('#removeSpace').modal('hide');

    }
}



async function searchUser(input, friendsOnly){
    
    let string = input.value;
    if(string.length >= 3){
       const datas = await Network.searchUser(string, friendsOnly);
       if(friendsOnly){
           UI.mountFriendsAutocomplete("autocomplete-list-friend", datas);
           UI.mountFriendsSpaceAutocomplete("autocomplete-list-space", datas);
        }else{
            UI.mountUsersAutocomplete("autocomplete-list", datas);
       }
    }
}


function setUserSelected(name, username, id){
    setValueOnInputUser(name, username, id);
    document.getElementById('autocomplete-list').innerHTML = " ";
}

function setValueOnInputUser(name, username, id){
    let input = document.getElementById('user-selected');
    input.value = `${name}(${username})`;
    input.setAttribute('data-id', id);
}


function addTagModal(){
    $('#addTag').modal('show');
    document.getElementById('new-tag').value="";
}

async function addNewTag(){
    const tag = document.getElementById('new-tag').value;

    if(tag){
        const response = await Network.addNewTag({"name":tag});
        if(response.status == SUCCESS_STATUS){
            this.initTagsList();
            $('#addTag').modal('hide');
        }
    }
}

function filterByTag(tag){
    if(tag.className == "default-tag"){
        tag.className = "selected-tag";
    }else{
        tag.className = "default-tag";
    }
    const input = document.getElementById('input_search')
    searchLinkByTag(input);
}



async function addLinkModal(){
    const tags = await Network.get_tags_list();
    UI.mountListTags(tags, "tags-new-link");
    document.getElementById('link-title').value = ""
    document.getElementById('link-url').value = ""
    document.getElementById('link-description').value = ""

    $('#addLink').modal('show');
}

async function addNewLink(){
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    const description = document.getElementById('link-description').value;
    const tags = document.querySelectorAll('.selected-tag-link');
    const tagsSelecteds = new Array();
    tags.forEach((el)=>{
        tagsSelecteds.push(el.id)
    })

    const datas = {
        "title":title,
        "url":url,
        "description":description,
        "tags":tagsSelecteds,
        "workspace":false,
    }
    const response = await Network.addNewLink(datas);
    initLinksList()
    $('#addLink').modal('hide');
}


async function addNewTag(){
    const tag = document.getElementById('new-tag').value;

    if(tag){
        const response = await Network.addNewTag({"name":tag});
        if(response.status == SUCCESS_STATUS){
            this.initTagsList();
            $('#addTag').modal('hide');
        }
    }
}
function selectTag(tag){
    
    if(tag.className == "default-tag-link"){
        tag.className = "selected-tag-link";
    }else{
        tag.className = "default-tag-link";
    }

}


async function readLinkContent(url, title){
    console.log("URL ", url);
    $('#readLink').modal('show'); 
}

function openLinkNewTab(url){
    console.log("URL ", url);
    window.open(url,"_blank");
}



function addFriendList(name, username, id){
    let friend = document.getElementById(`friendShare${id}`);
    if(friend == null){
        document.getElementById('autocomplete-list-friend').innerHTML = ' ';
        document.getElementById('friend-selected').value = "";
        rootElement = document.getElementById("list-friends");
        UI.createCardFriendShare(rootElement, id, username);
    }
}

function addFriendSpace(name, username, id){
    let friend = document.getElementById(`friendShare${id}`);
    if(friend == null){
        document.getElementById('autocomplete-list-space').innerHTML = ' ';
        document.getElementById('friend-selected-space').value = "";
        rootElement = document.getElementById("list-friends-space");
        UI.createCardFriendShare(rootElement, id, username);
    }
}

function deleteFriendShare(id_element){
    document.getElementById(`${id_element}`).remove();
}



async function shareLinkForFriends(btn){
    const link = btn.getAttribute('data-link');
    const users = [];

    document.querySelectorAll('.friend-share-card').forEach((el)=>{
        users.push(el.getAttribute('data-id'))
    })

    const response = await Network.send_link_shared({
        "link":link,
        "users":users
    });

    if(response.status == SUCCESS_STATUS){
        $('#shareLink').modal('hide');
    }

}

function shareLink(title, link_id){
    $('#shareLink').modal('show');
    document.getElementById('btn-share').setAttribute('data-link', link_id)
    document.getElementById('list-friends').innerHTML = ""

}


function showNotificationModal(){
    $('#modalNotifications').modal('show');    
}

async function readNotification(action, notification){
    console.log(action, notification);
    const response = await Network.readNotification(
        {
            "action":action,
            "notification":notification
        }
    );
    getTotalNotification();
    initFriendsList();
}

async function deleteLink(link, is_shared){
    console.log(link, is_shared)
    const response = await Network.linkDelete(
        {
            "link":link,
            "is_shared":is_shared
        }
    )
    initLinksList();
}

async function showSpaceSelected(workspace){
    console.log("Selectionar ", workspace);
    const response = await Network.workSpaceDetails(
        {"id":workspace}
    )
    console.log(response);
    document.getElementById('content').style="display:none";
    document.getElementById('content-spaces').style="";
    document.getElementById('current-space').textContent = response.name;
    document.getElementById('currentSpaceNameModal').textContent = response.name;
    document.getElementById('btnAddSpaceModal').setAttribute('data-id', workspace);


    UI.mountListTags(response.members, 'tags-content-space');
    UI.mountListLinksSpaces(response.links, 'links-list-content-space');
    console.log(response);
}

let currentSpace;
function addLinkSpaceModal(element){
    currentSpace = element.getAttribute('data-id');
    document.getElementById('link-title-space').value = ""
    document.getElementById('link-url-space').value = ""
    document.getElementById('link-description-space').value = ""

    $('#modalAddLinkSpace').modal('show'); 
}

async function addNewLinkSpace(){
    const title = document.getElementById('link-title-space').value;
    const url = document.getElementById('link-url-space').value;
    const description = document.getElementById('link-description-space').value;

    const datas = {
        "title":title,
        "url":url,
        "description":description,
        "workspace":currentSpace
    }
    const response = await Network.addNewLink(datas);
    $('#modalAddLinkSpace').modal('hide');
}


async function searchLink(input){
    const searchString = input.value;
    const tags = document.querySelectorAll('.selected-tag');
    const tagsSelecteds = new Array();
    tags.forEach((el)=>{
        tagsSelecteds.push(el.id)
    })

    if(searchString.length >= 3){
        console.log("presquisando por ", searchString);
        const response = await Network.searchLinks({
            "string":searchString,
            "tags":tagsSelecteds
        })
        console.log(response)
        UI.mountListLinks(response, "links-list-content");
    }else{
        initLinksList();
    }
}

async function searchLinkByTag(input){
    const searchString = input.value;
    const tags = document.querySelectorAll('.selected-tag');
    const tagsSelecteds = new Array();
    tags.forEach((el)=>{
        tagsSelecteds.push(el.id)
    })

    if(tagsSelecteds.length > 0){

        console.log("presquisando por ", searchString);
        const response = await Network.searchLinks({
            "string":searchString,
            "tags":tagsSelecteds
        })
        console.log(response)
        UI.mountListLinks(response, "links-list-content");

    }else{
        initLinksList();
    }

    
}






async function initFriendsList(){
    const friends = await Network.get_friends_list();
    UI.mountListFriends(friends);
}initFriendsList();

async function initWorkSpacesList(){
    const spaces = await Network.get_workspaces_list();
    UI.mountListSpaces(spaces);
}initWorkSpacesList();

async function initTagsList(){
    const tags = await Network.get_tags_list();
    UI.mountListTags(tags, "tags-content");
}initTagsList();

async function initLinksList(){
    const links = await Network.get_links_list();
    UI.mountListLinks(links, "links-list-content");
}initLinksList();

async function getTotalNotification(){
    const notificationElement = document.getElementById('count-notifications');

    const response = await Network.get_user_notifications();
    notificationElement.textContent = response.total;
    
    UI.mountListNotifications('list-notifications', response.results);

    console.log(response.results);
}getTotalNotification();

async function initListenNotifications(){
    var pusher = new Pusher('7f66f8f13624f8813eac', {
        cluster: 'us2'
    });

    const userChannel = await Network.get_user_channel();

    var channel = pusher.subscribe( String(userChannel) );
    channel.bind('notification', function(data) {
      console.log("Notificação Recebida ", data);
      getTotalNotification();
    });

}initListenNotifications();

async function reloadFriendsList(){
    var pusher = new Pusher('7f66f8f13624f8813eac', {
        cluster: 'us2'
    });

    const userChannel = await Network.get_user_channel();

    var channel = pusher.subscribe( String(userChannel) );
    channel.bind('reload-friend-list', function(data) {
      initFriendsList();
    });

}reloadFriendsList();

async function reloadLinksList(){
    var pusher = new Pusher('7f66f8f13624f8813eac', {
        cluster: 'us2'
    });

    const userChannel = await Network.get_user_channel();

    var channel = pusher.subscribe( String(userChannel) );
    channel.bind('reload-links-list', function(data) {
        initLinksList();
    });

}reloadLinksList();

async function reloadSpacesList(){
    var pusher = new Pusher('7f66f8f13624f8813eac', {
        cluster: 'us2'
    });

    const userChannel = await Network.get_user_channel();

    var channel = pusher.subscribe( String(userChannel) );
    channel.bind('reload-spaces-list', function(data) {
        initWorkSpacesList();
    });

}reloadSpacesList();

async function reloadSpacesLinksList(){
    var pusher = new Pusher('7f66f8f13624f8813eac', {
        cluster: 'us2'
    });

    const userChannel = await Network.get_user_channel();

    var channel = pusher.subscribe( String(userChannel) );
    channel.bind('reload-spaces-links', function(data) {
        const homePageContent = document.getElementById('content').style;
        if(homePageContent.display.length > 0){
            showSpaceSelected(data.space);
        }
    });

}reloadSpacesLinksList();