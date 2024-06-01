document.getElementById("star2").addEventListener("mouseover", (event)=> { mouseoverHandling(2) });
document.getElementById("star2").addEventListener("mouseout", (event)=> { mouseoutHandling(2) });
document.getElementById("star2").addEventListener("click", (event)=> { onclicktHandling(2) });

document.getElementById("star3").addEventListener("mouseover", (event)=> { mouseoverHandling(3) });
document.getElementById("star3").addEventListener("mouseout", (event)=> { mouseoutHandling(3) });
document.getElementById("star3").addEventListener("click", (event)=> { onclicktHandling(3) });

document.getElementById("star4").addEventListener("mouseover", (event)=> { mouseoverHandling(4) });
document.getElementById("star4").addEventListener("mouseout", (event)=> { mouseoutHandling(4) });
document.getElementById("star4").addEventListener("click", (event)=> { onclicktHandling(4) });

document.getElementById("star5").addEventListener("mouseover", (event)=> { mouseoverHandling(5) });
document.getElementById("star5").addEventListener("mouseout", (event)=> { mouseoutHandling(5) });
document.getElementById("star5").addEventListener("click", (event)=> { onclicktHandling(5) });

document.getElementById("add-note").addEventListener("click", (event)=> { 
    if (!edit)
    {
        return;
    }
    noteCount++;
    const newNote = document.createElement("input");
    newNote.setAttribute("type", "text");
    newNote.setAttribute("name", "note" + noteCount);
    newNote.setAttribute("id", "note" + noteCount);
    newNote.setAttribute("placeholder", "Insert a note here");
    newNote.setAttribute("class", "note-input");
    
    document.getElementById("submit-form").insertBefore(newNote, document.getElementById("add-note"));

    // <button id="remove-note<%= j + 1 %>" type="button"><i class="fa-solid fa-trash-can"></i></button>
    const newDel = document.createElement("button");
    newDel.setAttribute("type", "button");
    newDel.setAttribute("id", "remove-note" + noteCount);
    newDel.setAttribute("class", "note-button");
    newDel.setAttribute("onclick", "removeNote('"+ (noteCount) +"')" );
    newDel.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
    document.getElementById("submit-form").insertBefore(newDel, document.getElementById("add-note"));
 });

function mouseoverHandling(star)
{
    if (!edit)
    {
        return;
    }

    for (let i = minVal + 1; i <= star; i++)
    {
        document.getElementById("star" + i).classList.add("fa-solid");
        document.getElementById("star" + i).classList.remove("fa-regular");
    }
}

function mouseoutHandling(star)
{
    if (!edit)
    {
        return;
    }

    for (let i = minVal + 1; i <= 5; i++)
    {
        document.getElementById("star" + i).classList.remove("fa-solid");
        document.getElementById("star" + i).classList.add("fa-regular");
    }
}

function onclicktHandling(star)
{
    if (!edit)
    {
        return;
    }
    
    minVal = star;
    for (let i = minVal + 1; i <= 5; i++)
    {
        document.getElementById("star" + i).classList.remove("fa-solid");
        document.getElementById("star" + i).classList.add("fa-regular");
    }
    document.getElementById("rating").value = minVal;
}

function removeNote(elem) 
{
    noteCount--;
    document.getElementById("note" + elem).remove();
    document.getElementById("remove-note" + elem).remove();
}