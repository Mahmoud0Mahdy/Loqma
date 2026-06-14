import { Plus, MessageSquare, Bot, Trash2 } from "lucide-react";
import { useChatbotContext } from "../../../contexts/ChatbotContext";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

export function ChatSidebar() {
  const { clearChat, sessions, currentSessionId, loadSessionMessages, deleteSession } = useChatbotContext();

  const getDisplayTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length > 7) {
      return words.slice(0, 7).join(' ') + ' ...';
    }
    return title;
  };

  return (
    <aside className="cb-sidebar">
      {/* Header */}
      <div className="cb-sidebar-header">
        <div className="cb-sidebar-logo">
          <Bot size={20} />
        </div>
        <div className="cb-sidebar-title">
          <h2>Loqma AI</h2>
          <p>Recipe Assistant</p>
        </div>
      </div>

      {/* New Chat */}
      <button onClick={clearChat} className="cb-new-chat-btn">
        <Plus size={18} />
        New Chat
      </button>

      {/* History */}
      <div className="cb-history-section">
        <p className="cb-history-label">Recent Chats</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`cb-history-item ${currentSessionId === session.id ? 'active' : ''}`}
            >
              <button
                type="button"
                onClick={() => loadSessionMessages(session.id)}
                className="cb-history-main-btn"
              >
                <div className="cb-history-item-content">
                  <MessageSquare size={16} style={{ flexShrink: 0 }} />
                  <span className="cb-history-title-wrap" title={session.title}>
                    {getDisplayTitle(session.title)}
                  </span>
                </div>
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="cb-delete-btn"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{getDisplayTitle(session.title)}"?
                      <br />This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteSession(session.id);
                        
                        // Clear chat if the deleted session is the currently active one
                        if (session.id === currentSessionId) {
                          clearChat();
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div style={{ padding: '16px 8px', fontSize: '13px', color: '#94a3b8' }}>
            No conversations yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="cb-sidebar-footer">
        {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
      </div>
    </aside>
  );
}