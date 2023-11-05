const generarTokenConfirmacion = () => {
    //  Math.random().toString(32).substring(2);
    // '3r49hi53iso'
    // Math.random().toString(32).substring(2);
    // 'eosng9s2as'
    const random = Math.random().toString(32).substring(2);
    //  Date.now().toString(32);
    // '1gqlhrh66'
    // Date.now().toString(32);
    // '1gqlhrhsl'
    const fecha = Date.now().toString(32);
    
    return random + fecha;
}

export default generarTokenConfirmacion;