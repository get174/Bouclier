import { Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ResidentHeader } from '../../components/ResidentHeader';
import { useMenu } from '../../contexts/MenuContext';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  sender: string;
}

export default function ChatScreen() {
  const { toggleMenu } = useMenu();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue dans le chat de résidence',
      timestamp: '10:30 AM',
      isOwn: false,
      sender: 'Admin',
    },
    {
      id: '2',
      text: 'Vous pouvez communiquer avec d\'autres résidents et la gestion ici.',
      timestamp: '10:31 AM',
      isOwn: true,
      sender: 'Moi',
    },
    {
      id: '3',
      text: 'Le chat est maintenant disponible avec le nouveau design',
      timestamp: '10:32 AM',
      isOwn: false,
      sender: 'Admin',
    },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: true,
        sender: 'Moi',
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <ResidentHeader title="Chat" subtitle="Bouclier" onMenuPress={toggleMenu} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <View style={styles.chatArea}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContent}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.messageContainer}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    msg.isOwn ? styles.ownMessageWrapper : styles.otherMessageWrapper
                  ]}
                >
                  {!msg.isOwn && (
                    <Text style={styles.senderName}>{msg.sender}</Text>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      msg.isOwn ? styles.ownMessage : styles.otherMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      msg.isOwn ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                      {msg.text}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      msg.isOwn ? styles.ownMessageTime : styles.otherMessageTime
                    ]}>
                      {msg.timestamp}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Écrire un message..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Send size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  chatContent: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  messageContainer: {
    flex: 1,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  ownMessageWrapper: {
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  otherMessage: {
    backgroundColor: '#ffffff',
  },
  ownMessage: {
    backgroundColor: '#0891b2',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  otherMessageText: {
    color: '#1e293b',
  },
  ownMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  otherMessageTime: {
    color: '#64748b',
  },
  ownMessageTime: {
    color: '#bae6fd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#f1f5f9',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
    marginRight: 10,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});