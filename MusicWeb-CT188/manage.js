const SearchBtn = document.querySelector(".Header-searchbox__IMG");
const SearchInput = document.querySelector(".Header-searchbox__input");
const SignLog = document.querySelector(".Header-SignLog");
SearchBtn.addEventListener("click", () => {
    SearchInput.classList.toggle("active");
    SignLog.classList.toggle("active");
});
document.body.addEventListener("click", (e) => {
    if (
        !e.target.closest(".Header-searchbox__IMG") &&
        !e.target.closest(".Header-searchbox__input")
    ) {
        SearchInput.classList.remove("active");
        SignLog.classList.remove("active");
    }
});

// Đóng mở Modal

const addSongBtn = document.querySelector(".add-song");
const addGenreBtn = document.querySelector(".add-genres");
const modalAddSong = document.querySelector(".modal__add-song");
const modalAddGenre = document.querySelector(".modal__add-genre");
const modalOverlay = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".modal-close");

// Hàm mở modal và focus input đầu tiên
function openModal(modalSelector) {
    const modal = modalSelector.closest(".modal");
    if (modal) {
        modal.classList.add("show");
        const firstInput = modalSelector.querySelector("input");
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 100); // đợi một xíu để modal mở không thì focus input sẽ xảy ra trước sau đo sẽ ko hiển thị
        }
    }
}

// Hàm đóng tất cả modal
function closeAllModals() {
    modalOverlay.forEach((modal) => modal.classList.remove("show"));
}

// Mở modal khi click vào các nút add
if (addSongBtn && modalAddSong) {
    addSongBtn.addEventListener("click", () => openModal(modalAddSong));
}
if (addGenreBtn && modalAddGenre) {
    addGenreBtn.addEventListener("click", () => openModal(modalAddGenre));
}

// Khi nhấn vào nút X thì sẽ đóng modal
closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
});

// Đóng modal khi click ra ngoài nền
modalOverlay.forEach((modal) => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
});

const songForm = document.querySelector(".modal__add-song .form-add");
const songsList = document.querySelector(".songs__list");
const modalSong = document.querySelector(".modal__add-song");

const LOCAL_STORAGE_KEY = "songList";

// Lấy danh sách bài hát từ localStorage mà mình thêm từ lần trước
function getStoredSongs() {
    const songs = localStorage.getItem(LOCAL_STORAGE_KEY);
    return songs ? JSON.parse(songs) : [];
}

// Lưu danh sách bài hát vào localStorage
function saveSongs(songs) {
    //Chuyển sang chuổi rồi lưu vào localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs));
}

// Tạo thẻ <li> và thêm vào danh sách hiển thị
function renderSongItem(songData) {
    const li = document.createElement("li");
    li.className = "songs__item";

    // Tạo cấu trúc html theo mẫu của mình sau đó thêm các thuộc tính tương ứng đã nhập trong from nếu có.
    if (songData.image) {
        const artistDiv = document.createElement("div");
        artistDiv.className = "songs-artist";
        const img = document.createElement("img");
        img.src = songData.image;
        img.alt = "artist";
        artistDiv.appendChild(img);
        li.appendChild(artistDiv);
    }

    if (songData.title) {
        const titleEl = document.createElement("h3");
        titleEl.className = "name-song";
        titleEl.textContent = songData.title;
        li.appendChild(titleEl);
    }

    if (songData.artist) {
        const artistEl = document.createElement("span");
        artistEl.className = "name-artist";
        artistEl.textContent = songData.artist;
        li.appendChild(artistEl);
    }

    songsList.appendChild(li);
}

// Khi submit form
if (songForm && songsList) {
    // Dùng async ở đây để hồi xử lý ảnh mình dùng được await để chờ chuyển file ảnh thành dạng base64 để lưu vào localStorage vì localStorage chỉ lưu đc nội dung dưới dạng chuỗi
    songForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const titleInput = songForm.querySelector("#title");
        const artistInput = songForm.querySelector("#artist");
        const imageInput = songForm.querySelector("#image");

        const title = titleInput.value.trim();
        const artist = artistInput.value.trim();
        const imageFile = imageInput.files[0];
        if (!title || !artist) {
            showToast("Vui lòng nhập đầy đủ tên bài hát và nghệ sĩ", "error");
            return;
        }
        if (!title && !artist && !imageFile) return;

        let imageData = null;
        if (imageFile) {
            imageData = await fileToBase64(imageFile);
        }
        // Trong object thuộc tính vs key trùng thì mình ghi tắt được nha.
        const songData = { title, artist, image: imageData };

        // Thêm vào giao diện
        renderSongItem(songData);

        // Lưu vào localStorage
        const currentSongs = getStoredSongs();
        currentSongs.push(songData);
        saveSongs(currentSongs);
        showToast("Thêm thể loại thành công!", "success");
        // Reset và đóng modal
        songForm.reset();
        modalSong.closest(".modal").classList.remove("show");
    });
}

// Chuyển file → base64 để lưu vào localStorage (Cái này em không biết nên tham khảo AI).
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Khi load trang render lại danh sách để hiển thị các cái mà mình thêm hồi trước
window.addEventListener("DOMContentLoaded", () => {
    const songs = getStoredSongs();
    songs.forEach(renderSongItem);
});

//Tương tự như phần add-song ở trên
const genreForm = document.querySelector(".modal__add-genre .form-add");
const genresList = document.querySelector(".genres__list");
const modalGenre = document.querySelector(".modal__add-genre");

const LOCAL_STORAGE_GENRE_KEY = "genreList";

// Lấy danh sách genre từ localStorage
function getStoredGenres() {
    const genres = localStorage.getItem(LOCAL_STORAGE_GENRE_KEY);
    return genres ? JSON.parse(genres) : [];
}

// Lưu danh sách genre vào localStorage
function saveGenres(genres) {
    localStorage.setItem(LOCAL_STORAGE_GENRE_KEY, JSON.stringify(genres));
}

// Tạo và render thẻ <li> genre
function renderGenreItem(genreData) {
    const li = document.createElement("li");
    li.className = "genres__item";

    const wrapper = document.createElement("div");
    wrapper.className = "genres-artist";

    if (genreData.image) {
        const img = document.createElement("img");
        img.src = genreData.image;
        img.alt = "genre";
        wrapper.appendChild(img);
    }

    if (genreData.name) {
        const h3 = document.createElement("h3");
        h3.className = "name-genres";
        h3.textContent = genreData.name;
        wrapper.appendChild(h3);
    }

    li.appendChild(wrapper);
    genresList.appendChild(li);
}

// Khi mình submit from
if (genreForm && genresList) {
    genreForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput = genreForm.querySelector("#genre");
        const imageInput = genreForm.querySelector("#image");

        const name = nameInput.value.trim();
        if (!name) {
            showToast("Vui lòng nhập tên thể loại", "error");
            return;
        }
        // Ở trên quên nói khi mình chọn file thì nó lưu vô FileList kiểu giống giống mảng nên mình truy cập chỉ số đầu để lấy cái hình mình mới thêm á. Tại ảnh mình set thêm lần có 1 ảnh nên lấy thẳng index 0 luôn
        const imageFile = imageInput.files[0];

        if (!name && !imageFile) return;

        let imageData = null;
        if (imageFile) {
            imageData = await fileToBase64(imageFile);
        }

        const genreData = { name, image: imageData };

        // Hiển thị ra giao diện
        renderGenreItem(genreData);

        // Lưu vào localStorage
        const currentGenres = getStoredGenres();
        currentGenres.push(genreData);
        saveGenres(currentGenres);
        showToast("Thêm thể loại thành công!", "success");
        // Reset form và đóng modal
        genreForm.reset();
        modalGenre.closest(".modal").classList.remove("show");
    });
}

// Khi load trang thì render lại mấy cái mình thêm
window.addEventListener("DOMContentLoaded", () => {
    getStoredGenres().forEach(renderGenreItem);
});

//Hàm để hiển thị các thông báo
function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success" ? "✔" : "❌";

    toast.innerHTML = `
        <div class="message">
            <i>${icon}</i>
            <span>${message}</span>
        </div>
        <div class="close-btn">&times;</div>
    `;

    // Gắn vào toast-container
    toastContainer.appendChild(toast);

    // Nút đóng
    toast.querySelector(".close-btn").addEventListener("click", () => {
        toast.remove();
    });

    // Tự động biến mất
    setTimeout(() => {
        toast.remove();
    }, 4000);
}
