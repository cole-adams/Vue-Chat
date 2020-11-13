<template>
    <div class="window-container d-flex">
        <div class="chat-container d-flex flex-column justify-end">
            <div class="message-container">
                <div
                    v-for="(line, index) in lines" 
                    :key="index" 
                >
                    <Message 
                        v-if="line.message"
                        :message="line.message"
                        :isAuthor="line.message.author.username === user.username"
                    />
                    <div v-else class="py-2">
                        <div class="text-body-1">{{ line.info }}</div>
                    </div>
                </div>
                <div ref="bottom"> </div>
            </div>
            <v-text-field
                class="flex-grow-0"
                label="Message"
                v-model="message"
                :append-outer-icon="'mdi-send'"
                @click:append-outer="handleSubmit"
                @keydown.enter="handleSubmit"
                filled
                type="text"
            ></v-text-field>
        </div>
        <div class="user-container">
            <v-list>
                <v-subheader>Online Users</v-subheader>
                <v-list-item
                    v-for="(user, index) in users"
                    :key="index"
                >
                    <v-list-item-avatar :color="user.color" class="justify-center">
                        <span class="white--text headline">{{ user.username[0].toUpperCase() }}</span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title v-text="user.username"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MessageItem, User } from '../interfaces';
import Message from './Message.vue';
import io from 'socket.io-client';

@Component({
    components: {
        Message,
    }
})
export default class Chat extends Vue {
    private socket!: SocketIOClient.Socket;
    private user: User = {
        username: '',
        color: ''
    };
    private users: User[] = [];
    private message = '';

    private lines: ChatLine[] = [];

    private commands = [
        {
            command: 'name',
            arguments: -1,
            handler: this.changeUsername
        },
        {
            command: 'color',
            arguments: 1,
            handler: this.changeColor
        }
    ]

    created() {
        this.socket = io('localhost:3000');

        this.socket.on('chat message', (msg: MessageItem) => {
            this.lines.push({message: msg});
            console.log(this.$refs);
            setTimeout(()=>{
                (this.$refs.bottom as Element).scrollIntoView();
            },0);
        });

        this.socket.on('user', (user: User) => {
            this.user = user
        });

        this.socket.on('chat log', (log: MessageItem[]) =>{
            this.lines = [];
            for (const message of log) {
                this.lines.push({
                    message: message
                });
            }
            setTimeout(()=>{
                (this.$refs.bottom as Element).scrollIntoView();
            },0);
        });

        this.socket.on('online users', (users: User[]) =>{
            this.users = users;
        })
    }

    handleSubmit() {
        if (this.message[0] === '/') {
            this.handleCommand();
        } else {
            this.sendMessage();
        }
        this.message = '';
    }

    handleCommand() {
        const command = this.message.substring(1).split(" ");
        let matched = false;
        for (const func of this.commands) {
            if (func.command === command[0]) {
                matched = true;
                if (func.arguments === command.length-1 || func.arguments === -1) {
                    func.handler.apply(this, command.slice(1) as [string]);
                    break;
                } else {
                    this.displayAlert('Invalid number of arguments. ' + func.command + ' takes ' + func.arguments + ' argument(s)');
                }
            }
        }

        if (!matched) {
            this.displayAlert("'" + command[0] + "' is not a recongized command");
        }
    }

    changeUsername(...newName: string[]) {
        this.socket.emit('change username', newName.join(' '));
    }

    changeColor(newColor: string) {
        this.socket.emit('change color', '#' + newColor);
    }

    sendMessage() {
        this.socket.emit('chat message', this.message);
    }

    displayAlert(msg: string) {
        console.log("TODO");
    }

}

interface ChatLine {
    message?: MessageItem;
    info?: string;
}
</script>
<style scoped>

.chat-container {
    height:100%;
    width: 75%;
}

.message-container {
    max-height: 100%;
    overflow-y: auto;
}

.window-container {
    height: 100%;
    max-height: 100%;
    max-width: 960px;
    width: 100%;
}

.user-container {
    width: 25%;
    max-height: 100%;
    overflow-y: auto;
}

.wrap-text {
    white-space: normal;
    word-wrap: normal;
    width: 100%;
}

</style>