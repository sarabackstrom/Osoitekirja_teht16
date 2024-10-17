import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
//import { useState } from 'react';

const db = SQLite.openDatabaseSync('osoitekirjadb');

export  const luoTietokanta = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS osoite (id INTEGER PRIMARY KEY NOT NULL, hakusana TEXT, latitude REAL, longitude REAL);
        `);
        //haeOsoitteet();
    } catch (error) {
        console.error('Could not open database', error);
    }
};

export const haeOsoitteet = async () => {
    try {
        const list = await db.getAllAsync('SELECT * from osoite');
        return list;
    } catch (error) {
        console.error('Could not get items', error);
    }
};

export const lisaaOsoite = async (osoite) => {
    try {
        await db.runAsync('INSERT INTO osoite (hakusana, latitude, longitude) VALUES (?, ?, ?)', osoite.nimi, osoite.lat, osoite.lon);
        //haeOsoitteet();
    } catch (error) {
        console.error('Could not add item', error);
    }
}

export const deleteItem = async (id) => {
    try {
        await db.runAsync('DELETE FROM osoite WHERE id=?', id);
    } catch (error) {
        console.error('Could not delete item', error);
    }
}

export default db;