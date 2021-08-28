
// async function makePostRequest(url, data, csrftoken){
//   const response = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     credentials: 'include',
//     headers: new Headers({
//       'X-CSRFToken': csrftoken,
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//       'X-Requested-With': 'XMLHttpRequest'
//     })
//   })
//   return response
// }

// function makeGetRequest(url){}



// async function addNewTag(){
//   const STATUS_OK = 200;

//   var tagName = document.querySelector('#tagName');
//   const csrftoken = document.getElementsByName('csrfmiddlewaretoken');
//   const url = "./criar/tag";

//   const response = await makePostRequest(url, { name:tagName.value }, csrftoken[0].value );
//   const datas = await response.json();

//   if(response.status == STATUS_OK) {
//     createTagUI(tagName.value, datas.tag_id);
//     clearInput("tagName");
//   }
// }


// async function addNewLink(){
//   const STATUS_OK = 200;

//   const csrftoken = document.getElementsByName('csrfmiddlewaretoken');
//   const url = "./criar/links";
//   const datas = {
//     title: document.getElementById('titleForLink').value,
//     url: document.getElementById('url').value,
//     description: document.getElementById('description').value,
//     tags: getTagsSelecteds(),

//   }
//   const response = await makePostRequest(url, datas, csrftoken[0].value );

// }




// function createTagUI(tag_name, tag_id){
//   const tagListDIV = document.querySelector('#tagsList');
//   const tagLABEL = document.createElement('label');
  
//   tagLABEL.setAttribute('class', 'btn btn-sm btn-selected');
//   tagLABEL.setAttribute('id', tag_id);

//   tagLABEL.appendChild(document.createTextNode(tag_name));
//   tagListDIV.appendChild(tagLABEL);
// }


// function getTagsSelecteds(){
//   const tags = new Array();
//   const NOT_SELECTED = -1;

//   document.querySelectorAll('.tag-option').forEach((tagButtom)=>{
//     let selected = tagButtom.className.search("btn-selected");
//     if(selected != NOT_SELECTED){
//       tags.push(tagButtom.id);
//     }
//   });
//   return tags;

// }


// function clearInput(id_input){
//   document.getElementById(id_input).value = '';
// }



// function selectTag(buttom){
//   if(buttom.className == "tag-option btn btn-sm btn-pink"){
//     buttom.className = "tag-option btn btn-sm btn-selected"
//   }else{
//     buttom.className = "tag-option btn btn-sm btn-pink"
//   }
// }
