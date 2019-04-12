//===== database function
var db = firebase.database();

//add data
function add_data() {
    var timestamp = Date.now(); 
    db.ref('todolist/column').push({
        content: "",
        date: timestamp,
        done:0
    }, 
    function(error) {
        if (error) {
            // The write failed...
            alert("資料庫更新失敗!");
        } else {
            // Data saved successfully!
        }
    });
    console.log("add to database");
    read_data(); //reload data from db again
}

//update data
function update_data(key,content,done){
    db.ref('todolist/column/'+key).update({
        content: content,
        done:done
    }, 
    function(error) {
        if (error) {
            // The write failed...
            alert("資料庫更新失敗!");
        } else {
            // Data saved successfully!
        }
    });
    read_data(); //reload data from db again
}

//delete data
function delete_data(key){
    db.ref('todolist/column/'+key).remove();
    console.log('delete');
    read_data(); //reload data from db again
}

//load all data
function read_data(){
    var unfinished_column = '<div class="list_title"> - 待完成</div>';
    var finished_column = '<div class="list_title"> - 已完成</div>';
    db.ref('todolist/column').once('value',function(snapshot){
        snapshot.forEach(function(data){
            var recieved_content = data.val().content; //get content
            var placeholder = ''; //set placeholder word
            if(data.val().content == "") placeholder = '新增...';
            //
            if(data.val().done){ //if == 1
                //build html
                finished_column += '<div class="column"><input type="checkbox" class="list_checkbox"><s class="list_content" name="'
                +data.key+'">'+recieved_content+
                '</s><img class="del_column_button" src="del.png" alt="" ></div>';
            }else{ // if == 0
                //build html
                unfinished_column += '<div class="column"><input type="checkbox" class="list_checkbox"><input type="text" class="list_content" name="'
                +data.key+'" placeholder="'+placeholder+'" value="'+recieved_content+
                '"><img class="del_column_button" src="del.png" alt="" ></div>';
            }
            //console.log(data.val());
        });
        $('#unfinished_list').html(unfinished_column); //add html 
        $('#finished_list').html(finished_column); //add html
        set_focus_detect(); //set all input be focus detected
        set_focusin_handler();//focusin handler
        set_del_column_button(); //set all del_column_button
        set_checkbox();
        //set_press_enter_invalid(); //set all input prevent from press enter
    }, 
    function(error) {
        if (error) {
            // The write failed...
            alert("資料庫讀取失敗!");
        } else {
             // Data saved successfully!
        }
    });
}

//===== other functions
//checkbox handler
function set_checkbox(){ 
    $(".list_checkbox").click(function(){
    //checkbox will soon change state after click it.
    var name = $(this).next().attr('name');
    if($(this).prop("checked")){ 
        var content = $(this).next().val();
        if(content == ""){
            alert("此欄空白!");
            $(this).prop('checked',false);
        }else   update_data(name,content,1); 
    }else{  //is checked
        var content = $(this).next().text();
        update_data(name,content,0);      
    }
    });
    $("#finished_list").children(".column").children(".list_checkbox").prop('checked',true);
}  
//set all list_content focus detect
function set_focus_detect(){
    $(".list_content").focusout(function(){
        var name = $(this).attr('name');
        var content = $(this).val();
        update_data(name,content,0);
    });
};
//focusin handler (prevent other focusin event occur )
function set_focusin_handler(){
    $(".list_content").focusin(function(){
        //$(".list_content").not(this).prop('disabled', true);
        $(".list_content").not(this).css("cursor","default");
        $(".list_content").not(this).css("box-shadow"," 0 0 0px");
        //$(this).css("box-shadow","0 0 3px rgb(238, 238, 238)");
        $(".list_content").css("background","rgba(0,0,0,0)");
        $(".list_content").not(this).focusin(function(event){
            $(this).blur();
            
        });    
    });
};
//set all del_column_button
function set_del_column_button(){
    $(".del_column_button").click(function(){
        var name = $(this).prev().attr('name');
        var answer = confirm("刪除該筆資料嗎?");
        if (answer) {
            delete_data(name);
        }
    });
}  

//prevent form submit
// function set_press_enter_invalid(){
//    $('.list_content').keypress(function(e) {
//         if(e.which == 13) {
//             $(this).focus();
//         }
//     }); 
// }


//=====document ready
$( document ).ready(function() {
    read_data();
    set_focus_detect();

    //===== events handler
    $(".add_button").click(function(){
        add_data();
    });
});





