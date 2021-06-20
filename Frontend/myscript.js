


$(function() {
let $mylist = $('#mylist');

let show = ''+
'<li><strong>Name: </strong>{{name}}<br>'+
'<strong>Rank: </strong>{{rank}}<br>'+
'<button class="btn btn-danger remove" id="{{id}}">Delete</button>'+
'<button class="btn btn-info edit" id="{{id}}">Update</button>'+
'<hr></li>'

    //Get Employee List
    $.ajax({
       type:"GET",
       url: 'http://localhost:8000/employee',
       success: function(data) {
        $.each(data, function(i, item) {
            for(let j = 0; j < item.length; j++) {
                $mylist.append(Mustache.render(show, item[j]));
            }
        });
       },
       error: function() {
        alert('Error loading page.');
       }
    });

    //Create Employee
    $('#btn1').on('click', function() {
        let info = {
            "name": $('#name').val(),
            "rank": $('#rank').val(),
            "email": $('#mail').val()
        };

        $.ajax({
            type:'POST',
            url: 'http://localhost:8000/employee',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(info),
            success: function(new_info) {
                console.log(new_info[new_info.length - 1]);
                $mylist.append(Mustache.render(show, new_info[new_info.length - 1]));
            },
            error: function() {
                alert("Error!!!");
            }
        });
        $("#name").val("");
        $("#rank").val(""),
        $("#mail").val("");

    });

    //Delete Employee
    $mylist.delegate('.remove' ,'click', function() {

    let $li = $(this).closest('li');
    console.log($(this).attr('id'));
        $.ajax({
            type:'DELETE',
            url: 'http://localhost:8000/employee/' + $(this).attr('id'),
            success: function() {
                $li.remove();
                alert("Employee Deleted!");
            },
            error: function() {
                alert("Error!!!");
            }
        });
    });

    //Update Employee
    $mylist.delegate('.edit' ,'click', function() {

    let $li = $(this).closest('li');
    let $put = $(this).attr('id');

    $.ajax({
       type:"GET",
       url: 'http://localhost:8000/employee/'+ $put,
       success: function(data) {
       console.log(data.name);
        $("#name").val(data.name);
        $("#rank").val(data.rank);
        $("#mail").val(data.email);
       },
       error: function() {
        alert('Error loading page.');
       }
    });

        $('#btn3').on('click', function() {
        $li.remove();
        let info = {
            "name": $('#name').val(),
            "rank": $('#rank').val(),
            "email": $('#mail').val()
        };

        $.ajax({
            type:'PUT',
            url: 'http://localhost:8000/employee/'+ $put,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(info),
            success: function(data) {
                console.log(data);
                $mylist.append(Mustache.render(show, data));
            },
            error: function() {
                alert("Error!!!");
            }
        });
        $("#name").val("");
        $("#rank").val(""),
        $("#mail").val("");


        });

    });

});