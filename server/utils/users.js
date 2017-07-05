class Users {
    constructor() {
        this.allusers = [];
    }
    addUser(id, name, room) {
        var user = { id, name, room };
        this.allusers.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);
        if (user) {
            this.allusers = this.allusers.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.allusers.find((user) => user.id === id);
    }

    isUserAlreadyPresent(name, room) {
        return this.allusers.find((user) => user.name === name && user.room === room);
    }

    getUserlist(room) {
        return this.allusers.filter((user) => user.room === room).map((user) => user.name);

    }
}


module.exports = { Users };