test('Should be a Tutor', async (user) => {
    if(user.type==2){
        throw new Error('User is not a tutor')
    }
})