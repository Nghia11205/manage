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