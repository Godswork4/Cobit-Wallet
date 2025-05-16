import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  sender: 'me' | 'contact';
  timestamp: string;
}

export default function ChatMessage({ content, sender, timestamp }: ChatMessageProps) {
  const isMe = sender === 'me';
  
  return (
    <div className={cn(
      "flex",
      isMe ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] p-3 rounded-lg",
        isMe 
          ? "bg-orange-500 text-white rounded-br-none" 
          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
      )}>
        <p>{content}</p>
        <div className={cn(
          "text-right text-xs mt-1",
          isMe ? "text-orange-100" : "text-gray-500"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}