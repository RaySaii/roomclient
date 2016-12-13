const devUrl = {
    socket: 'http://localhost:3000',
    rest: 'http://localhost:3000/api/'
};
const prodUrl = {
    // socket: 'http://raysaii-room.daoapp.io',
    socket: '',
    // rest: 'http://raysaii-room.daoapp.io/api/',
    rest: '',
};

export const URL = {
    socket: prodUrl.socket || devUrl.socket,
    rest: prodUrl.rest || devUrl.rest
}