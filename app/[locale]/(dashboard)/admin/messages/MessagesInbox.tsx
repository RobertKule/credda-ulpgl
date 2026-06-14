"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, MailOpen, Archive, Search, CornerUpLeft, 
  Send, X, Clock
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactMessage, MessageStatus } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { getMessages, updateMessageStatus, archiveMessage } from "@/services/message-actions";

type FilterType = 'ALL' | 'UNREAD' | 'ARCHIVED';

export default function MessagesInbox() {
  const t = useTranslations("MessagesInbox");
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const result = await getMessages();
      if (result.success && result.data) {
        setMessages(result.data as ContactMessage[]);
      }
      setIsLoading(false);
    };
    fetchMessages();
  }, []);

  // Filter and search messages
  const filteredMessages = useMemo(() => {
    return messages
      .filter(msg => {
        if (filter === 'UNREAD') return msg.status === 'UNREAD';
        if (filter === 'ARCHIVED') return msg.status === 'ARCHIVED';
        return msg.status !== 'ARCHIVED';
      })
      .filter(msg => {
        const query = searchQuery.toLowerCase();
        return (
          msg.name.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, searchQuery, filter]);

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsReplying(false);
    setReplyText("");
    
    // Mark as read when selected
    if (message.status === 'UNREAD') {
      const result = await updateMessageStatus(message.id, 'READ');
      if (result.success) {
        setMessages(prev => 
          prev.map(m => 
            m.id === message.id ? { ...m, status: 'READ' as MessageStatus } : m
          )
        );
      }
    }
  };

  const handleToggleReadStatus = async (message: ContactMessage) => {
    const newStatus = message.status === 'UNREAD' ? 'READ' : 'UNREAD';
    const result = await updateMessageStatus(message.id, newStatus);
    if (result.success) {
      setMessages(prev => 
        prev.map(m => {
          if (m.id === message.id) {
            return { ...m, status: newStatus as MessageStatus };
          }
          return m;
        })
      );
    } else {
      toast.error("Failed to update message status");
    }
  };

  const handleArchive = async (message: ContactMessage) => {
    const result = await archiveMessage(message.id);
    if (result.success) {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'ARCHIVED' as MessageStatus }
            : m
        )
      );
      setSelectedMessage(null);
      toast.success(t('messages.archived'));
    } else {
      toast.error("Failed to archive message");
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error(t('messages.emptyReply'));
      return;
    }
    
    // For now, just simulate the reply
    // In production, this would send an actual email
    setIsReplying(false);
    setReplyText("");
    toast.success(t('messages.replied'));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return t('filters.yesterday');
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }
  };

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case 'UNREAD':
        return 'bg-emerald-500';
      case 'READ':
        return 'bg-neutral-300 dark:bg-neutral-600';
      case 'ARCHIVED':
        return 'bg-neutral-400 dark:bg-neutral-500';
      default:
        return 'bg-neutral-300';
    }
  };

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-2rem)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="text-neutral-500 dark:text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex">
      {/* Left Column - Message List */}
      <div className="w-2/5 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
              {t('title')}
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            {(['ALL', 'UNREAD', 'ARCHIVED'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === filterType
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {t(`filters.${filterType.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-8"
              >
                <Mail className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {t('empty.noMessages')}
                </p>
              </motion.div>
            ) : (
              filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleSelectMessage(message)}
                  className={`p-4 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                    selectedMessage?.id === message.id 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500' 
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(message.status)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold text-sm truncate ${
                          message.status === 'UNREAD' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {message.name}
                        </span>
                        <span className="text-xs text-neutral-400 ml-2 flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm truncate mb-1 ${
                        message.status === 'UNREAD' ? 'font-medium text-neutral-800 dark:text-neutral-200' : 'text-neutral-500 dark:text-neutral-500'
                      }`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column - Reading Panel */}
      <div className="w-3/5 flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedMessage ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center p-8"
            >
              <MailOpen className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
              <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white mb-2">
                {t('empty.title')}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md">
                {t('empty.description')}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleReadStatus(selectedMessage)}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {selectedMessage.status === 'UNREAD' ? (
                      <>
                        <MailOpen className="w-4 h-4 mr-2" />
                        {t('actions.markRead')}
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        {t('actions.markUnread')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(selectedMessage)}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {t('actions.archive')}
                  </Button>
                </div>
                <Button
                  onClick={() => setIsReplying(!isReplying)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  <CornerUpLeft className="w-4 h-4 mr-2" />
                  {t('actions.reply')}
                </Button>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white mb-4">
                    {selectedMessage.subject}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {selectedMessage.name}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                          {selectedMessage.email}
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-neutral-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">
                        {selectedMessage.createdAt.toLocaleString('fr-FR', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply Section */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-neutral-900 dark:text-white">
                            {t('reply.title')}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReplying(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t('reply.placeholder')}
                          className="min-h-[150px] mb-4 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-neutral-900"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => setIsReplying(false)}
                          >
                            {t('reply.cancel')}
                          </Button>
                          <Button
                            onClick={handleReply}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {t('reply.send')}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
