function is_latin_letter_or_digit(event) {
    const charCode = event.charCode || event.keyCode;
    return (charCode >= 65 && charCode <= 90) ||
    (charCode >= 97 && charCode <= 122) ||
    (charCode >= 48 && charCode <= 57);
}