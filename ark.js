        //gets the ini because there nor front end ini libraries. fml
        async function getINI() {
            try{
                const response = await fetch("http://23.244.152.144:4500/ark-get")
                const data = await response.json()
                return data
            } catch(err) {
                console.log("get error" + err)
            }
        }
        
        
        let ini = {}
        let displayArr = []
        
        getINI().then(data =>{
            ini = data
            const settingsArray = jsonToArray(data);
        
            displayArr = settingsArray
            displaySettings(displayArr)
            addListeners(displayArr)
        })
        
        // Function to convert JSON into an array of objects
        function jsonToArray(jsonData) {
            const resultArray = [];
        
            function iterateJson(obj) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];
        
                        // Create an object with key-value pair
                        const item = { key: key, value: value };
        
                        // Add to the result array
                        resultArray.push(item);
        
                        // If the value is an object, recursively process it
                        if (typeof value === 'object') {
                            iterateJson(value);
                        }
                    }
                }
            }
            // Start the iteration
            iterateJson(jsonData);
        
            return resultArray;
        }
        
        const settingsHTML = document.getElementById("settings-list");
        
        // Function to display settings
        function displaySettings(arr) {
            settingsHTML.innerHTML = "";
        
            arr.forEach(setting => {
                settingsHTML.insertAdjacentHTML('beforeend', `
                    <div class="setting">
                        <div class="setting-input">
                            <label class="setting-label">${setting.key}:</label>
                            <input type="text" placeholder="${setting.value}" id="${setting.key}" class="setting-input">
                        </div>
                    </div>
                `);
            });
        }
        
        const search = document.getElementById("search-box");
        
        //search funtionality
        search.addEventListener('input', () => {
            if(search.value){
                settingsHTML.innerHTML = `
                <l-reuleaux
                size="37"
                stroke="5"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.2"
                color="white" 
                ></l-reuleaux>
                `
        
                let searchArr = []
                let regex = new RegExp(search.value)
        
                displayArr.forEach(elm => {
                    if(regex.test(elm.key.toLowerCase())){
                        searchArr.push(elm)
                    }
                })
        
                displaySettings(searchArr)
                addListeners(searchArr)
            }else{
                displaySettings(displayArr)
                addListeners(displayArr)
            }
        });
        
        //add an event listener for all things with an id = to the keys
        function addListeners(arr) {
            arr.forEach(elm => {
                const element = document.getElementById(elm.key);
                if (element) {
                    element.addEventListener('input', () => {
                        ini.shootergamemode[elm.key] = element.value;
                    });
                }
            });
        }
        
        //save settings button logic below here
        const saveButton = document.getElementById("save-settings")
        
        saveButton.addEventListener("click", saveSettingsPost)
        
        async function saveSettingsPost(){
            try{
                const response = await fetch('http://23.244.152.144:4500/ark-post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ini)
                })
                console.log(response.status)
            }
            catch(error){
                console.log("saving ini error" + error)
            }
        }
        
        async function startServer(){
            const command = {toggle:'start'}
        
            const response = await fetch('http://23.244.152.144:4500/server-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(command)
            })
            getStatus()
            const data = await response.json()
            return data.ServerStatus
        }
        
        async function stopServer(){
            const command = {toggle:'stop'}
        
            const response = await fetch('http://23.244.152.144:4500/server-toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(command)
            })
            getStatus()
            const data = await response.json()
            return data.ServerStatus
        }
        
        async function sendCommand(cmd){
            const response = await fetch('http://23.244.152.144:4500/send-command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({command:cmd})
            })
            const data = await response.json()
            return data.response
        }
        
        document.getElementById('start-server').addEventListener('click', (e) => {
            startServer()
        })
        
        document.getElementById('stop-server').addEventListener('click', (e) => {
            stopServer()
        })
        
        document.getElementById('send-command-button').addEventListener('click', () => {
            if(document.getElementById("send-command").value){    
                sendCommand(document.getElementById("send-command").value)
            }
        })
        
        