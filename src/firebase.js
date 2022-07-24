import firebase from "firebase/app";
import "firebase/messaging";
import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyBdsu5NA56MBo6Sm8yMDqqv4__gwrBvV10",
  authDomain: "happyvacation-2abc8.firebaseapp.com",
  projectId: "happyvacation-2abc8",
  storageBucket: "happyvacation-2abc8.appspot.com",
  messagingSenderId: "510792644323",
  appId: "1:510792644323:web:7c268bad0fe29e401a37d6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const requestForToken = () => {
    return messaging.getToken({
        vapidKey:
            "BCi_3lAlaiEN1U2kP-Z8Q65AQ28voEO1lGwipIEwFIjbtebUDFVo4ZhL3h21udY4CwxnSQvJilf2oTm-ofTijcw",
    }).then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });

export const subscribeToTopic = (topicName, handler = () => {}) =>
    messaging.getToken( { vapidKey: "BCi_3lAlaiEN1U2kP-Z8Q65AQ28voEO1lGwipIEwFIjbtebUDFVo4ZhL3h21udY4CwxnSQvJilf2oTm-ofTijcw"})
    .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
            const FCM_SERVER_KEY = "AAAAdu2dNuM:APA91bGsH2OY569rWyVyDUhOhxNYgGLj8l-rDLg_8S_KKCwjLTpSCfwcwY_zXZS5mulfjXyACMBDt0YXKOJwXDLEmTI7CuPl0aRQyQ8gdpj6VMGMXQvCqKBlfC4ZKq5b3qGCaae4cy1w";
            // Subscribe to the topic
            const topicURL = `https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/${topicName}`;
            axios.post(
              topicURL,
              { data: 'data'},
              {
                headers: { Authorization:`key=${FCM_SERVER_KEY}` }
              }
            ).then((response) => {
              console.log('Successfully subscribed to topic: ' + topicName);
            })
            .catch(() => {
              console.log('Cannot subscribe to topic: ' + topicName)
            })
        }
    });



  export const unSubscribeToTopic = (topicName, handler = () => {}) =>
    messaging.getToken( { vapidKey: "BCi_3lAlaiEN1U2kP-Z8Q65AQ28voEO1lGwipIEwFIjbtebUDFVo4ZhL3h21udY4CwxnSQvJilf2oTm-ofTijcw"})
    .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
            const FCM_SERVER_KEY = "AAAAdu2dNuM:APA91bGsH2OY569rWyVyDUhOhxNYgGLj8l-rDLg_8S_KKCwjLTpSCfwcwY_zXZS5mulfjXyACMBDt0YXKOJwXDLEmTI7CuPl0aRQyQ8gdpj6VMGMXQvCqKBlfC4ZKq5b3qGCaae4cy1w";
            // Subscribe to the topic
            const topicURL = `https://iid.googleapis.com/iid/v1:batchRemove`;
            axios.post(
              topicURL,
              // { data: 'data'},
              {
                to: `/topics/${topicName}`,
                registration_tokens: [`${currentToken}`]
              },
              {
                headers: { Authorization:`key=${FCM_SERVER_KEY}` }
              }
            ).then((response) => {
              console.log('Successfully un subscribed to topic: ' + topicName);
            })
            .catch(() => {
              console.log('Cannot un subscribe to topic: ' + topicName)
            })
        }
    });

  // export const getCurrentTopics = (handler = () => {}) =>
  //   messaging.getToken( { vapidKey: "BCi_3lAlaiEN1U2kP-Z8Q65AQ28voEO1lGwipIEwFIjbtebUDFVo4ZhL3h21udY4CwxnSQvJilf2oTm-ofTijcw"})
  //   .then((currentToken) => {
  //       if (currentToken) {
  //         console.log('current token for client: ', currentToken);
  //         const FCM_SERVER_KEY = "AAAAdu2dNuM:APA91bGsH2OY569rWyVyDUhOhxNYgGLj8l-rDLg_8S_KKCwjLTpSCfwcwY_zXZS5mulfjXyACMBDt0YXKOJwXDLEmTI7CuPl0aRQyQ8gdpj6VMGMXQvCqKBlfC4ZKq5b3qGCaae4cy1w";
  //         // Subscribe to the topic
  //         const get_topic_URL = `https://iid.googleapis.com/iid/info/${currentToken}?details=true`;
  //         axios.get(
  //           get_topic_URL,
  //           {
  //             headers: { Authorization:`key=${FCM_SERVER_KEY}` }
  //           }
  //         ).then((response) => {
  //           console.log('Successfully get current topic: ', response);
  //           return response.data.rel.topics
  //         })
  //         .catch(() => {
  //           console.log('Cannot get current topic');
  //         })
  //       }
  //   });  
  export const getCurrentTopics = async (handler = () => {}) => {
    let currentToken = await messaging.getToken( { vapidKey: "BCi_3lAlaiEN1U2kP-Z8Q65AQ28voEO1lGwipIEwFIjbtebUDFVo4ZhL3h21udY4CwxnSQvJilf2oTm-ofTijcw"})
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      const FCM_SERVER_KEY = "AAAAdu2dNuM:APA91bGsH2OY569rWyVyDUhOhxNYgGLj8l-rDLg_8S_KKCwjLTpSCfwcwY_zXZS5mulfjXyACMBDt0YXKOJwXDLEmTI7CuPl0aRQyQ8gdpj6VMGMXQvCqKBlfC4ZKq5b3qGCaae4cy1w";
      const get_topic_URL = `https://iid.googleapis.com/iid/info/${currentToken}?details=true`;
      try {      
        let res = await axios.get(
          get_topic_URL,
          {
            headers: { Authorization:`key=${FCM_SERVER_KEY}` }
          }
        )
        //console.log('Successfully get current topics: ', res);
        if(res.data.rel) {
          return Object.keys(res.data.rel.topics);
        } else {
          return []
        }
      } catch(e) {
        console.log('Cannot get current topics', e)
      }
    }
  }
    

