import {
  Plus,
  MessageSquare,
  Bot,
  Trash2,
} from "lucide-react";

import { useChatbotContext } from "../../../contexts/ChatbotContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

export function ChatSidebar() {
  const {
    clearChat,
    sessions,
    currentSessionId,
    loadSessionMessages,
    deleteSession,
  } = useChatbotContext();

  return (
    <aside
      className="
        h-screen
        w-64
        shrink-0
        border-r
        border-gray-200
        bg-[#f9f9f9]
        flex
        flex-col
      "
    >
      {/* Header */}
      <div className="p-3">
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-green-600
              text-white
            "
          >
            <Bot size={18} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              FreshMart AI
            </h2>

            <p className="text-xs text-gray-500">
              Recipe Assistant
            </p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-3">
        <button
          onClick={clearChat}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            font-medium
            transition-all
            hover:bg-gray-50
            hover:shadow-sm
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2">
        <p
          className="
            px-3
            py-2
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-gray-400
          "
        >
          Recent Chats
        </p>

        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`
                group
                flex
                items-center
                rounded-xl
                transition-all
                ${
                  currentSessionId === session.id
                    ? "bg-white shadow-sm"
                    : "hover:bg-white"
                }
              `}
            >
              <button
                onClick={() =>
                  loadSessionMessages(session.id)
                }
                className="
                  flex
                  flex-1
                  items-center
                  gap-3
                  px-3
                  py-3
                  text-left
                  text-sm
                "
              >
                <MessageSquare
                  size={16}
                  className="text-gray-500"
                />

                <div className="flex min-w-0 flex-col">
                  <span className="truncate">
                    {session.title}
                  </span>
                </div>
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="
                      mr-2
                      rounded-lg
                      p-1.5
                      text-gray-400
                      opacity-0
                      transition
                      hover:bg-red-50
                      hover:text-red-500
                      group-hover:opacity-100
                    "
                  >
                    <Trash2 size={14} />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Conversation
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to
                      delete "
                      {session.title}"?
                      <br />
                      This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={() =>
                        deleteSession(
                          session.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                      "
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
          <div className="px-3 py-4 text-sm text-gray-400">
            No conversations yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="
          border-t
          border-gray-200
          p-4
          text-xs
          text-gray-500
        "
      >
        {sessions.length} conversation
        {sessions.length !== 1 ? "s" : ""}
      </div>
    </aside>
  );
}