const booksForm = document.getElementById("booksForm");
let booksArray = JSON.parse(localStorage.getItem("booksArr")) || [];
  const updateBookBtn = document.getElementById("updateBookBtn");



function setLocalStorage() {
  localStorage.setItem("booksArr", JSON.stringify(booksArray));
}

function snackBar(msg) {
  Swal.fire({
    text: msg,
    icon: "success",
    timer: 3000
  })
}

// read 
function renderBooks(arr) {
  const booksContainer = document.getElementById("booksContainer");

  let res = "";
  arr.forEach((book, index) => {
    res += `
      <tr id="${book.id}">
        <td>${index + 1}</td>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.genere}</td>
        <td>${book.publishDate}</td>
        <td class="text-center"><button onclick="onEdit(this)" class="btn btn-sm btn-outline-info">Edit</button></td>
        <td class="text-center"><button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">Delete</button></td>
       </tr>
    `;
    booksContainer.innerHTML = res;
  });
}
renderBooks(booksArray)

function onSubmit(event) {
  const booksContainer = document.getElementById("booksContainer");
  const bookName = document.getElementById("bookName");
  const author = document.getElementById("author");
  const genere = document.getElementById("genere");
  const publishDate = document.getElementById("publishDate");

  event.preventDefault();
  const bookObj = {
    name: bookName.value,
    author: author.value,
    genere: genere.value,
    publishDate: publishDate.value,
    id: Date.now().toString()
  }
  booksArray.push(bookObj);
  setLocalStorage();
  booksForm.reset();

  let newTr = document.createElement("tr");
  newTr.id = bookObj.id;
  newTr.innerHTML = `
        <td>${booksArray.length}</td>
        <td>${bookObj.name}</td>
        <td>${bookObj.author}</td>
        <td>${bookObj.genere}</td>
        <td>${bookObj.publishDate}</td>
        <td class="text-center"><button onclick="onEdit(this)" class="btn btn-sm btn-outline-info">Edit</button></td>
        <td class="text-center"><button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">Delete</button></td>
  `;
  booksContainer.append(newTr);
  snackBar("Your book added successfully...")
}


//edit
function onEdit(ele) {
  const bookName = document.getElementById("bookName");
  const author = document.getElementById("author");
  const genere = document.getElementById("genere");
  const publishDate = document.getElementById("publishDate");
  const addBookBtn = document.getElementById("addBookBtn");
  const updateBookBtn = document.getElementById("updateBookBtn");

  const editId = ele.closest("tr").id;
  localStorage.setItem("updateId", editId);
  const editObj = booksArray.find(book => book.id === editId);
  //patch values
  bookName.value = editObj.name;
  author.value = editObj.author;
  genere.value = editObj.genere;
  publishDate.value = editObj.publishDate;
  addBookBtn.classList.add("d-none");
  updateBookBtn.classList.remove("d-none");
}


//udpate
function onUpdate(){
  const bookName = document.getElementById("bookName");
  const author = document.getElementById("author");
  const genere = document.getElementById("genere");
  const publishDate = document.getElementById("publishDate");
  const addBookBtn = document.getElementById("addBookBtn");
  const updateBookBtn = document.getElementById("updateBookBtn");
  const updateId = localStorage.getItem("updateId");

  localStorage.removeItem("udpateId");
  const updatedObj = {
    name: bookName.value,
    author: author.value,
    genere: genere.value,
    publishDate: publishDate.value,
    id: updateId
  }
  booksForm.reset();
  const udpateIndex = booksArray.findIndex(book => book.id === updateId);
  booksArray[udpateIndex] = updatedObj;
  setLocalStorage();
  //update ui
  let udpateTr = document.getElementById(updateId);
  let tds = udpateTr.querySelectorAll("tr td");
  tds[1].innerText = updatedObj.name;
  tds[2].innerText = updatedObj.author;
  tds[3].innerText = updatedObj.genere;
  tds[4].innerText = updatedObj.publishDate;
  updateBookBtn.classList.add("d-none");
  addBookBtn.classList.remove("d-none");
  snackBar("Your book updated successfully...")
}



function onDelete(ele) {
  const deleteId = ele.closest("tr").id;
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this book!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const deleteIndex = booksArray.findIndex(book => book.id === deleteId);
      booksArray.splice(deleteIndex, 1);
      setLocalStorage();
      ele.closest("tr").remove();

      Swal.fire({
        title: "Deleted!",
        text: "Your book has been deleted.",
        icon: "success"
      });
    }
  });
}


booksForm.addEventListener("submit", onSubmit);
updateBookBtn.addEventListener("click", onUpdate);