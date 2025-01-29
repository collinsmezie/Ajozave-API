const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(
      'mongodb+srv://collins:IOODaG8iW9uhBA3E@cluster0.wqhme71.mongodb.net/?retryWrites=true&w=majority',
    );
    console.log('Connection successful');
  } catch (error) {
    console.error('Connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
