


const createAdmin = async(data:any)=>{
    const hashedPassword: string = await bcrypt.hash(data.password, 12)
    const userData ={
        email: data.admin.email,
        password:hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await pris
}