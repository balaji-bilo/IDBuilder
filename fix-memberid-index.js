/**
 * Run this script ONCE to fix the leftover memberId index in MongoDB.
 * Command: node fix-memberid-index.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voter_db';

async function fixIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const collection = db.collection('voters');

        // List all current indexes
        const indexes = await collection.indexes();
        console.log('\nCurrent indexes:', indexes.map(i => i.name));

        // Drop the memberId index if it exists
        const memberIdIndex = indexes.find(i => i.key && i.key.memberId !== undefined);
        if (memberIdIndex) {
            console.log(`\nDropping old memberId index: "${memberIdIndex.name}"`);
            await collection.dropIndex(memberIdIndex.name);
            console.log('✅ memberId index dropped successfully!');
        } else {
            console.log('\n✅ No memberId index found — already clean!');
        }

        await mongoose.disconnect();
        console.log('\nDone. You can now restart your backend server.\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixIndex();
