// How to:
// 1) Login into https://icloud.com
// 2) Open the developer tools and execute this code in the console
const _API_URL='https://p18-mailws.icloud.com/wm/recents';
const _requestContacts = () => {
        console.warn('Requesting your contacts...');
        return fetch(_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                credentials: 'include',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'list',
                }),
            }).catch(error => {
                console.error('An error happened while trying to list your contacts:', error);
            });
    }, _deleteContacts = (contacts) => {
        console.warn('Asking the backend to delete data it should not have...');
        return fetch(_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            credentials: 'include',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'delete',
                params: {
                    guids: contacts
                },
            }),
        }).catch(error => {
            console.error('An error happened while trying to delete your contacts:', error);
        });
    }, listAllContactsDetainedByApple = async () => {
        const contacts = await (await _requestContacts()).json();
        console.warn(`Here is the raw list of the contacts (${contacts.result.length}):`);
        console.warn(JSON.stringify(contacts));
    },
    deleteEverythingForever = async () => {
        const guids = [];
        const contacts = (await (await _requestContacts()).json()).result;
        for (const contact of contacts) {
            if (contact.guid) {
                console.warn(`Added address ${contact.address} to the deletion list`);
                guids.push(contact.guid);
            }
            // Cover groups as well
            if (contact.isMemberOf) {
                for (const group of contact.isMemberOf) {
                    if (group.guid) {
                        console.warn(`Added ${contact.address} (group) to the deletion list`);
                        guids.push(group.guid);
                    }
                }
            }
        }
        if (guids === undefined || guids.length == 0) {
            return console.error('No contact to delete');
        }
        const response = await _deleteContacts(guids);
        console.warn('Done! All your recents contact has been deleted from iCloud Mail.');
        console.log(response);
    };
console.warn(window.atob("DQogXyBfX19fXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICAgICAgDQooXykgIF9fIFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgfCAgICAgICAgICAgICAgDQogX3wgfF9fKSB8X19fIF8gX18gX19fICAgX19fIF8gX18gX19fIHwgfF9fICAgX19fIF8gX18gDQp8IHwgIF8gIC8vIF8gXCAnXyBgIF8gXCAvIF8gXCAnXyBgIF8gXHwgJ18gXCAvIF8gXCAnX198DQp8IHwgfCBcIFwgIF9fLyB8IHwgfCB8IHwgIF9fLyB8IHwgfCB8IHwgfF8pIHwgIF9fLyB8ICAgDQp8X3xffCAgXF9cX19ffF98IHxffCB8X3xcX19ffF98IHxffCB8X3xfLl9fLyBcX19ffF98ICAgDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg")),console.warn("To see all the email addresses you ever contacted using Apple Mail since the launch of iCloud, run listAllContactsDetainedByApple()"),console.warn("Since Apple does not provide a way to delete everything at once, or even see the full list, you can easily delete everything forever by running deleteEverythingForever()");
