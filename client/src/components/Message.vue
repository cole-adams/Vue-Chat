<template>
    <div 
        class="d-flex message-username"
        :class="{ 'justify-end': isAuthor }"
    >
        <v-avatar v-if="!isAuthor" :color="message.author.color">
            <span class="white--text headline">{{message.author.username[0].toUpperCase()}}</span>
        </v-avatar>

        <div class="d-flex flex-column px-2 message-box">
            <div class="text-caption">{{ message.author.username }} at {{ message.timestamp }}</div>
            <v-card
                elevation="1"
                class="rounded-b-xl"
                :class="{
                    'rounded-tr-xl': !isAuthor, 
                    'rounded-tl-xl': isAuthor
                }"
                :color="boxColor"
            >
                <v-card-text>{{ message.content }}</v-card-text>
            </v-card>
        </div>

        <v-avatar v-if="isAuthor" :color="message.author.color">
            <span class="white--text headline">{{message.author.username[0].toUpperCase()}}</span>
        </v-avatar>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MessageItem, User } from '../interfaces';

@Component
export default class Message extends Vue {
    @Prop() message!: MessageItem;
    @Prop() isAuthor!: boolean;

    get boxColor() {
        if (this.isAuthor) {
            return '#90CAF9';
        } else {
            return '#FFFFFF';
        }
    }
}
</script>
<style scoped>
.message-box {
    max-width: calc(100% - 53px);
}

.message-username {
    padding-bottom: 10px;
    max-width: 100%;
}

.authored-card {
    background-color: #BDBDBD;
}
</style>