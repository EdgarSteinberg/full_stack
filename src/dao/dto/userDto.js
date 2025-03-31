class UserDto {
    constructor(user) {
        this._id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart; // ✅ Ahora incluye el carrito
        this.age = user.age;
        this.documents = user.documents;
    }
}

export default UserDto;
