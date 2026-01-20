import { useState } from 'react';
import { RedditThread, RedditComment } from '@/data/mockRedditThreads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RedditThreadsProps {
  threads: RedditThread[];
}

const CommentItem = ({ comment, depth = 0 }: { comment: RedditComment; depth?: number }) => {
  const [showReplies, setShowReplies] = useState(true);

  const getSentimentColor = () => {
    switch (comment.sentiment) {
      case 'positive':
        return 'border-l-signal-bullish';
      case 'negative':
        return 'border-l-signal-bearish';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <div className={cn('pl-4 border-l-2', getSentimentColor(), depth > 0 && 'ml-4')}>
      <div className="py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <User className="h-3 w-3" />
          <span className="font-medium">{comment.author}</span>
          <span>•</span>
          <span>{comment.timeAgo}</span>
        </div>
        <p className="text-sm text-foreground/90">{comment.text}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUp className="h-3 w-3" />
            <span>{comment.upvotes}</span>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </Button>
          )}
        </div>
      </div>
      {showReplies && comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
};

const ThreadCard = ({ thread }: { thread: RedditThread }) => {
  const [expanded, setExpanded] = useState(false);

  const getSentimentBadge = () => {
    switch (thread.sentiment) {
      case 'positive':
        return <Badge variant="bullish" className="text-xs">Positive</Badge>;
      case 'negative':
        return <Badge variant="bearish" className="text-xs">Negative</Badge>;
      default:
        return <Badge variant="neutral" className="text-xs">Neutral</Badge>;
    }
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="text-primary font-medium">{thread.subreddit}</span>
              <span>•</span>
              <span>u/{thread.author}</span>
              <span>•</span>
              <span>{thread.timeAgo}</span>
            </div>
            <h4 className="font-semibold text-foreground leading-tight">{thread.title}</h4>
          </div>
          {getSentimentBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{thread.preview}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium">{thread.upvotes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{thread.commentCount} comments</span>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto text-xs h-7">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Reddit
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-between h-9"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-sm">
            {expanded ? 'Hide' : 'Show'} Top Comments ({thread.comments.length})
          </span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {expanded && (
          <div className="border-t border-border/50 pt-4 space-y-1">
            {thread.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const RedditThreads = ({ threads }: RedditThreadsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">💬</span>
          Reddit Discussions
        </h3>
        <Badge variant="outline" className="text-xs">
          {threads.length} threads
        </Badge>
      </div>
      
      <div className="space-y-4">
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
};
