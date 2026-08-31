import axios from "axios"
import { useEffect } from "react";
import { useState } from "react";

function AddBooks() {
    const[book,setBook]=useState([])
    const[title,setTitle]=useState("")
    const[author,setAuthor]=useState("")
    const[price,setPrice]=useState("")
    const[category,setCategory]=useState("programming")
    const[available,setAvailable]=useState("yes")
    const[editId,setEditId]=useState(null)

    useEffect(function(){
        axios.get("http://localhost:5000/booklist")
        .then(function(data){
          console.log(data.data)
          setBook(data.data)
        })
    },[])

    function handleTitle(e){
        setTitle(e.target.value)
    }

    function handleAuthor(e){
        setAuthor(e.target.value)
    }

    function handlePrice(e){
        setPrice(e.target.value)
    }

    function handleCategory(e){
        setCategory(e.target.value)
    }
    
    function handleAvailable(e){
        setAvailable(e.target.value)
    }

    function clearForm(){
        setTitle("")
        setAuthor("")
        setPrice("")
        setCategory("programming")
        setAvailable("yes")
        setEditId(null)
    }

    function addList(){
        if(editId){
            axios.put(`http://localhost:5000/updatelist/${editId}`,{newbook:{title,author,price,category,available}})
            .then(function(response){
                if(response.data.status==="success"){
                    setBook(book.map(item => item._id === editId ? {_id:editId,title,author,price,category,available} : item))
                    clearForm()
                }
            })
        } else {
            axios.post("http://localhost:5000/addlist", {
    newbook:{title,author,price,category,available}
})
.then(function(response){
    if(response.data.status==="success"){
        setBook([...book,response.data.book])
        clearForm()
    }
})
        }
    }

    function handleEdit(item){
        setTitle(item.title)
        setAuthor(item.author)
        setPrice(item.price)
        setCategory(item.category)
        setAvailable(item.available)
        setEditId(item._id)
    }

    function handleDelete(id){
        if(!id){
            alert("Error: Book ID is missing")
            return
        }
        
        if(window.confirm("Are you sure you want to delete this book?")){
            axios.delete(`http://localhost:5000/deletelist/${id}`)
            .then(function(response){
                console.log("Delete response:", response.data)
                if(response.data && response.data.status==="success"){
                    // Remove from local state
                    setBook(book.filter(item => item._id !== id))
                    alert("Book deleted successfully!")
                } else {
                    alert("Failed to delete book. Please try again.")
                }
            })
            .catch(function(error){
                console.log("Delete error:", error.message)
                alert("Error: " + (error.response?.data?.message || error.message || "Failed to delete book"))
                // Refresh the list to ensure it's in sync with the server
                axios.get("http://localhost:5000/booklist")
                .then(function(data){
                    setBook(data.data)
                })
            })
        }
    }

  return (
    <>
        <div className="flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-[#f8d8d1] bg-white/90 shadow-[0_28px_70px_-18px_rgba(15,118,110,0.28)] backdrop-blur-sm">
                <div className="bg-linear-to-r from-[#d45a2b] via-[#d84878] to-[#1e9890] px-6 py-7 sm:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.35em] text-white/80">
                                Library Dashboard
                            </p>
                            <h1 className="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">{editId ? "Update Book" : "Add Book"}</h1>
                        </div>
                        <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl text-white shadow-inner shadow-white/20 sm:flex">
                            <i className="fa-solid fa-book-open-reader"></i>
                        </div>
                    </div>
                </div>

                <form className="space-y-6 p-6 sm:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text" value={title} onChange={handleTitle}
                                placeholder="Enter book title"
                                className="mt-2 w-full rounded-2xl border border-[#f3d7d0] bg-[#fffaf8] px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#ff8a65] focus:bg-white focus:ring-4 focus:ring-[#ffe1d8]"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">Author</label>
                            <input
                                type="text" value={author} onChange={handleAuthor}
                                placeholder="Enter author name"
                                className="mt-2 w-full rounded-2xl border border-[#f3d7d0] bg-[#fffaf8] px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#ff8a65] focus:bg-white focus:ring-4 focus:ring-[#ffe1d8]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">Category</label>
                            <select
                                name="Category" value={category} onChange={handleCategory}
                                className="mt-2 w-full rounded-2xl border border-[#f3d7d0] bg-[#fffaf8] px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 focus:border-[#ff8a65] focus:bg-white focus:ring-4 focus:ring-[#ffe1d8]"
                            >
                                <option value="programming">Programming</option>
                                <option value="database">Database</option>
                                <option value="algorithm">Algorithm</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">Price</label>
                            <input
                                type="number" 
                                placeholder="0.00" value={price} onChange={handlePrice}
                                className="mt-2 w-full rounded-2xl border border-[#f3d7d0] bg-[#fffaf8] px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#ff8a65] focus:bg-white focus:ring-4 focus:ring-[#ffe1d8]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs sm:text-sm font-semibold text-slate-700">Available</label>
                        <select
                            name="Available" value={available} onChange={handleAvailable}
                            className="mt-2 w-full rounded-2xl border border-[#f3d7d0] bg-[#fffaf8] px-4 py-3 text-xs sm:text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 focus:border-[#ff8a65] focus:bg-white focus:ring-4 focus:ring-[#ffe1d8]"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#f7d9d0] pt-4 sm:flex-row">
                        <button
                            type="button" onClick={addList}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#ff7a59] to-[#f06292] px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_15px_30px_-12px_rgba(240,98,146,0.8)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-12px_rgba(240,98,146,0.85)] focus:outline-none focus:ring-4 focus:ring-[#ffd7d0]"
                        >
                            <i className="fa-solid fa-plus"></i>
                            {editId ? "Update Book" : "Add Book"}
                        </button>

                        {editId && (
                            <button
                                type="button" onClick={clearForm}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d8f5f1] bg-[#f6fffe] px-5 py-3.5 text-sm font-bold text-[#0f766e] shadow-sm transition duration-200 hover:-transl
                                ate-y-0.5 hover:border-[#7ad7cd] hover:bg-[#ecfffd] focus:outline-none focus:ring-4 focus:ring-[#cdf5f1]"
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-4 pb-10">
            <div className="overflow-hidden rounded-[20px] border border-[#f3d7d0] bg-white shadow-[0_20px_50px_-12px_rgba(15,118,110,0.15)]">
                <div className="bg-linear-to-r from-[#d45a2b] via-[#d84878] to-[#1e9890] px-6 py-5 sm:px-8">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                        <i className="fa-solid fa-list"></i>
                        Library Books
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#f3d7d0] bg-[#fffaf8]">
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-700">Title</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-700">Author</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-700">Category</th>
                                <th className="px-6 py-4 text-left text-xs sm:text-sm font-bold text-slate-700">Price</th>
                                <th className="px-6 py-4 text-center text-xs sm:text-sm font-bold text-slate-700">Available</th>
                                <th className="px-6 py-4 text-center text-xs sm:text-sm font-bold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {book.map(function(item, index) {
                                return (
                                    <tr key={index} className="border-b border-[#f3d7d0] transition duration-150 hover:bg-[#fef5f3]">
                                        <td className="px-6 py-4 text-xs sm:text-sm text-slate-700 font-medium">{item.title}</td>
                                        <td className="px-6 py-4 text-xs sm:text-sm text-slate-600">{item.author}</td>
                                        <td className="px-6 py-4 text-xs sm:text-sm text-slate-600">{item.category}</td>
                                        <td className="px-6 py-4 text-xs sm:text-sm text-slate-700 font-semibold">${item.price}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${item.available === "yes" ? "bg-[#d1f4f0] text-[#0f766e]" : "bg-[#ffd7d0] text-[#b91c1c]"}`}>
                                                {item.available === "yes" ? <><i className="fa-solid fa-check mr-1"></i>Yes</> : <><i className="fa-solid fa-times mr-1"></i>No</>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-[#fff3f1] px-3 py-2 text-xs font-bold text-[#d97706] transition duration-200 hover:bg-[#fed7aa] focus:outline-none focus:ring-2 focus:ring-[#fed7aa]"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-[#fee2e2] px-3 py-2 text-xs font-bold text-[#b91c1c] transition duration-200 hover:bg-[#fecaca] focus:outline-none focus:ring-2 focus:ring-[#fecaca]"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {book.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <i className="fa-solid fa-book text-4xl text-[#f3d7d0] mb-4"></i>
                        <p className="text-slate-500 font-medium">No books added yet. Start by adding a new book!</p>
                    </div>
                )}
            </div>
        </div>
  </>
  );
}

export default AddBooks