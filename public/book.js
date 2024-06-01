async function deleteBook() {
    const deleteResp = await fetch('/book/' + bookId,  {
        method: 'DELETE', 
        redirect: 'follow'
      });
    if (deleteResp.status == 200)
    {
        window.location.href = "/";
    }
}

function enterEditMode() {
    edit = true;
    var elems = document.querySelectorAll(".display-element");
    [].forEach.call(elems, function(el) {
        el.classList.add("hidden");
    });

    elems = document.querySelectorAll(".edit-element");
    [].forEach.call(elems, function(el) {
        el.classList.remove("hidden");
    });
}