const likeButton = document.querySelectorAll('.like-button');
const dislikeButton = document.querySelectorAll('.dislike-button');
const likeCounter = document.querySelectorAll('.likes');

let isSending = false;

for (i = 0; i < dislikeButton.length; i++) {
    dislikeButton[i].addEventListener('click', () =>{
        if(!isSending) {
            isSending = true;
            axios.post(`post/${likeButton[i].dataset.userId}/like`)
            .then((response) => {
                console.log(response)
                if (response.data.success) {
                    likes[i].textContent = response.data.totalLikes.likedMe;
                }
                dislikeButton[i].classList.add('hidden');
                likeButton[i].classList.remove('hidden');
                isSending = false;
            })
            .catch((err) => {
                isSending = false;
                console.log(err)
            })
        }
    })
}

for (i = 0; i < likeButton.length; i++) {
    likeButton[i].addEventListener('click', () =>{
        if(!isSending) {
            isSending = true;
            axios.post(`post/${dislikeButton[i].dataset.userId}/unlike`)
            .then((response) => {
                console.log(response)
                if (response.data.success) {
                    likes[i].textContent = response.data.totalLikes.likedMe;
                }
                likeButton[i].classList.add('hidden');
                dislikeButton[i].classList.remove('hidden');
                isSending = false;
            })
            .catch((err) => {
                isSending = false;
                console.log(err)
            })
        }
    })
}