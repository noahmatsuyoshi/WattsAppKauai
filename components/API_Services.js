import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const mainURL = 'http://172.20.10.4:8080/'
const issueTypesURL = mainURL + 'issuetypes/';
const loginURL = mainURL + 'api/token/';
const refreshTokenURL = mainURL + 'api/token/refresh/';
const getMyUserInfoURL = mainURL + 'api/v1/rest-auth/user/';
const changeUserInfoURL = mainURL + 'employees/';
const postIssueURL = mainURL + 'issues/';
const getAllIssuesURL = mainURL + 'issues/';
const getAllUsersURL = mainURL + 'employees/';
const createUserURL = mainURL + 'api/v1/rest-auth/registration/';
const editUserURL = mainURL + 'employees/';
const editIssueURL = mainURL + 'issues/';
const changePasswordURL = mainURL + 'api/v1/rest-auth/password/change/';
const registerDeviceForPushURL = mainURL + 'push/'
const sendPushNotificationURL = mainURL + 'push/send/'

export default class API_Services extends React.Component {
    static accessToken = '';
    static refreshToken = '';
    static employee = false;
    static userAdministrator = false;
    static userName = '';
    static userPhone = '';
    static userEmail = '';
    static userPK = '';
    static userPasswordChange = false;
    static guestUsername = 'wattsappkauaiguest@kiuc.coop';
    static guestPassword = 'kiuc1234';
    static header = null;
    static issues = null;
    static newIssueNotifications = null;

    static sleep (milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    static setHeaderInstance(header) {
        this.header = header;
    }

    static assignKey(data) {
        for(let item of data) {
            item.key = item.pk + "";
        }
        return data;
    }

    static removeBlankFields(data) {
        let newData = {};
        dataKeys = Object.keys(data);
        for(let key of dataKeys) {
            if(data[key] !== "") {
                newData[key] = data[key];
            }
        }
        return newData;
    }

    static removeNullFields(data) {
        let newData = {};
        dataKeys = Object.keys(data);
        for(let key of dataKeys) {
            if(data[key] !== null) {
                newData[key] = data[key];
            }
        }
        return newData;
    }

    static async Login(username, password) {
        let response = await this.loginRequest(loginURL, {username: username, password: password});
        let responseJSON = await response.json();
        this.accessToken = responseJSON.access;
        this.refreshToken = responseJSON.refresh
        if(this.accessToken != undefined) {
            await this.getMyUserInfo();
        }
        return {response: response, responseJSON: responseJSON};
        
    }

    static async useRefreshToken() {
        let data = {"refresh": this.refreshToken};
        try {
            let parameters = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(data)
            }
            let response = await fetch(refreshTokenURL, parameters);
            let responseJSON = await response.json();
            if(response.status == 401) {
                await this.header.startSignIn();
            } else {
                this.accessToken = responseJSON.access;
            }
            return response;
        } catch(error) {
            console.error(error);
        }
    }

    static async registerDeviceForPush(registration_id) {
        return await this.postRequest(registerDeviceForPushURL, {registration_id: registration_id});
    }

    static async sendPushNotification(message, admins, employees, members) {
        return await this.postRequest(sendPushNotificationURL, {
            message: message,
            admins: admins,
            employees: employees,
            members: members
        });
    }

    static async getMyUserInfo() {
        let response = await this.getRequest(getMyUserInfoURL);
        let responseJSON = await response.json();
        this.userAdministrator = responseJSON.admin;
        this.userName = responseJSON.name;
        this.userPhone = responseJSON.phone;
        this.userEmail = responseJSON.email;
        this.userPK = responseJSON.pk;
        this.userPasswordChange = responseJSON.passwordChange;
        this.newIssueNotifications = responseJSON.newIssueNotifications;

        return {response: response, responseJSON: responseJSON};
    }

    static async changePassword(password1, password2, oldPassword) {
        return await this.postRequest(changePasswordURL, {new_password1: password1, new_password2: password2, old_password: oldPassword});

    }
    
    static async postIssue(description, type, latitude, longitude, image, posterName, posterPhone, posterEmail) {
        let response = await this.postRequest(postIssueURL, {description: description, issueType: type.issueType, latitude: latitude, longitude: longitude, image: image, resolved: false, posterName: posterName, posterPhone: posterPhone, posterEmail: posterEmail, notes: ""});
        let responseJSON = await response.json();
        return response;
    }

    static async getAllIssues() {
        let showResolvedIssues = await AsyncStorage.getItem('showResolvedIssues') == "true";
        let response = await this.getRequest(getAllIssuesURL + (showResolvedIssues ? "resolved/" : ""));
        let responseJSON = await response.json();
        this.issues = this.assignKey(responseJSON);
        return {response: response, responseJSON: responseJSON};
    }

    static async getOneIssue(pk) {
        return await this.getRequest(getAllIssuesURL + pk + '/');
    }

    static async changeResolveStatus(pk, newStatus) {
        return await this.patchRequest(editIssueURL+pk+'/', {resolved: newStatus});
    }

    static async changeNotes(pk, notes) {
        return await this.patchRequest(editIssueURL+pk+'/', {notes: notes});
    }

    static async getIssueTypes() {
        return await this.getRequest(issueTypesURL);
    }

    static async createIssueType(issueType) {
        return await this.postRequest(issueTypesURL, {issueType: issueType});
    }

    static async deleteIssueType(pk) {
        return await this.deleteRequest(issueTypesURL, pk)
    }
    
    static async getAllUsers() {
        return await this.getRequest(getAllUsersURL);
    }

    static async createUser(data) {
        return await this.postRequest(createUserURL, data);
    }

    static async changeUserInfo(name, phone, email, pk=null, admin=null, passwordChange=null, newIssueNotifications=null) {
        data = {name: name, phone: phone, email: email};
        if(admin != null) {
            data.admin = admin;
        }
        if(passwordChange != null) {
            data.passwordChange = passwordChange;
        }
        if(newIssueNotifications != null) {
            data.newIssueNotifications = newIssueNotifications;
        }
        if(pk == null) {
            pk = this.userPK;
        }
        data = this.removeBlankFields(data);
        data = this.removeNullFields(data);
        return await this.patchRequest(changeUserInfoURL+pk+'/', data)
    }

    static async deleteUser(pk) {
        return await this.deleteRequest(editUserURL, pk);
    }

    static async deleteRequest(URL, pk) {
        if(pk) {
            URL += pk + "/";
        }
        return await this.requestWithAccessToken(URL, 'DELETE')
    }

    static async loginRequest(URL, data) {
        try {
            let response = await fetch(URL, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response;
        } catch(error) {
            console.error(error);
        }
    }

    static async getRequest(URL) {
        return await this.requestWithAccessToken(URL, 'GET');
    }

    static async postRequest(URL, data) {
        return await this.requestWithAccessToken(URL, 'POST', data);
    }

    static async putRequest(URL, data) {
        return await this.requestWithAccessToken(URL, 'PUT', data);
    }

    static async patchRequest(URL, data) {
        
        return await this.requestWithAccessToken(URL, 'PATCH', data);
    }

    static async requestWithAccessToken(URL, method, data = {}, refreshed = false) {
        try {
            let parameters = {
                method: method,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(data)
            }
            if(parameters.body == '{}') {
                delete parameters.body;
            }
            let response = await fetch(URL, parameters);
            if(response.status == 401 && !refreshed) {
                await this.useRefreshToken();
                return await this.requestWithAccessToken(URL, method, data, true);
            } 
            return response;
            
        } catch(error) {
            console.error(error);
        }
    }
}