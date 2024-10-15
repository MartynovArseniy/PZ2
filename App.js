import React, { useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import './App.css';  // Импорт CSS файла
const UserRegistration = require('./abi.json');
const DataStorageABI = require('./dataStorageAbi.json'); // ABI для контракта DataStorage

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isRegisteredStatus, setIsRegisteredStatus] = useState(false);
    const [isDeactivatedStatus, setIsDeactivatedStatus] = useState(false);

    const [data, setData] = useState('');
    const [dataId, setDataId] = useState('');
    const [retrievedData, setRetrievedData] = useState('');
    const [newData, setNewData] = useState(''); // Для обновления данных
    const contractAddress = '0x900ec7f63e37d020794081eb040e678d0635e2b7';
    const dataStorageAddress = '0x875a0ef4019b6caf9c79aa7321771ad98736d7b9'; // Адрес контракта DataStorage

    // Функция регистрации пользователя
    const registerUser = async () => {
        if (!email || !password) {
            setMessage('Please fill in all fields');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, UserRegistration, signer);

            const tx = await contract.register(email, password);
            await tx.wait();

            setMessage('You have been successfully registered!');
            setIsDeactivatedStatus(false);
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    };

    // Проверка регистрации пользователя
    const checkRegistration = async () => {
        if (!email) {
            setMessage('Please enter your email to check registration status');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, UserRegistration, signer);

            const registered = await contract.isRegistered(email);
            setIsRegisteredStatus(registered);
            setMessage(`User registration status: ${registered ? 'Registered' : 'Not Registered'}`);
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while checking registration status. Please try again.');
        }
    };

    // Деактивация пользователя
    const deactivateUser = async () => {
        if (!email) {
            setMessage('Please enter your email to deactivate the user');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, UserRegistration, signer);

            const tx = await contract.deactivate(email);
            await tx.wait();

            setMessage('User has been successfully deactivated!');
            setIsDeactivatedStatus(true);
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while deactivating the user. Please try again.');
        }
    };

    // Функции для контракта DataStorage
    const writeData = async () => {
        if (!data) {
            setMessage('Please enter data to write');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const dataStorageContract = new Contract(dataStorageAddress, DataStorageABI, signer);

            const tx = await dataStorageContract.writeData(data);
            await tx.wait();

            setMessage('Data written successfully!');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while writing data.');
        }
    };

    const getData = async () => {
        if (!dataId) {
            setMessage('Please enter data ID to retrieve');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const dataStorageContract = new Contract(dataStorageAddress, DataStorageABI, signer);

            const result = await dataStorageContract.getData(dataId);
            setRetrievedData(result);
            setMessage('Data retrieved successfully!');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while retrieving data.');
        }
    };

    // Обновление данных
    const updateData = async () => {
        if (!dataId || !newData) {
            setMessage('Please enter both data ID and new data to update');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const dataStorageContract = new Contract(dataStorageAddress, DataStorageABI, signer);

            const tx = await dataStorageContract.updateData(dataId, newData);
            await tx.wait();

            setMessage('Data updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while updating data.');
        }
    };

    // Удаление данных
    const deleteData = async () => {
        if (!dataId) {
            setMessage('Please enter data ID to delete');
            return;
        }

        try {
            if (!window.ethereum) {
                setMessage('Please install MetaMask');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const dataStorageContract = new Contract(dataStorageAddress, DataStorageABI, signer);

            const tx = await dataStorageContract.deleteData(dataId);
            await tx.wait();

            setMessage('Data deleted successfully!');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while deleting data.');
        }
    };

    return (
        <div className="container">
            <h1>User Registration</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
            />
            <button onClick={registerUser} className="button">Register</button>
            <button onClick={checkRegistration} className="button">Check Registration Status</button>
            <button onClick={deactivateUser} className="button">Deactivate User</button>
            <p className="message">{message}</p>
            {isRegisteredStatus !== undefined && (
                <p>User is: {isRegisteredStatus ? 'Registered' : 'Not Registered'}</p>
            )}
            {isDeactivatedStatus && <p>User is deactivated.</p>}

            <h1>Data Storage</h1>
            <input
                type="text"
                placeholder="Data to store"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="input"
            />
            <button onClick={writeData} className="button">Write Data</button>
            <input
                type="text"
                placeholder="Data ID to retrieve"
                value={dataId}
                onChange={(e) => setDataId(e.target.value)}
                className="input"
            />
            <button onClick={getData} className="button">Get Data</button>
            {retrievedData && <p>Retrieved Data: {retrievedData}</p>}

            <input
                type="text"
                placeholder="New data to update"
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                className="input"
            />
            <button onClick={updateData} className="button">Update Data</button>
            <h2>Delete Data</h2>
            <input
                type="text"
                placeholder="Data ID to delete"
                value={dataId}
                onChange={(e) => setDataId(e.target.value)}
                className="input"
            />
            <button onClick={deleteData} className="button">Delete Data</button>
            {/*<button onClick={deleteData} className="button">Delete Data</button>*/}
        </div>
    );
};

export default App;
