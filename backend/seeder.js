const mongoose =require('mongoose') 
const dotenv =require('dotenv') 
const colors =require('colors') 
const users =require('./data/users') 
const habdresses =require('./data/habdresses') 
const User =require('./models/userModel') 
const Habdress =require('./models/dressModel') 
const Order =require('./models/orderModel') 
const connectDB =require('./config/db') 

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Habdress.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleDresses = habdresses.map((habdress) => {
      
      return { ...habdress, user: adminUser }
    })

    await Habdress.insertMany(sampleDresses)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Habdress.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
