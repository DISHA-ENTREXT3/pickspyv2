import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Heart, MessageCircle, Share2, Play } from 'lucide-react';

interface InstagramComment {
  id: string;
  username: string;
  text: string;
  likes: number;
}

interface ReelData {
  id: string;
  thumbnail: string;
  videoUrl?: string;
  likes: string;
  comments: string;
  caption: string;
  topComments: InstagramComment[];
}

interface InstagramReelsProps {
  productName: string;
}

export const InstagramReels = ({ productName }: InstagramReelsProps) => {
  // Demo data for reels
  const reels: ReelData[] = [
    {
      id: 'r1',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
      likes: '124K',
      comments: '1.2K',
      caption: `Unboxing the new ${productName}! 🚀 This is a total game changer for my daily routine. #tech #viral #musthave`,
      topComments: [
        { id: 'c1', username: 'trend_finder', text: 'I need this right now! Where can I buy?', likes: 450 },
        { id: 'c2', username: 'gadget_guru', text: 'The quality looks insane for that price.', likes: 230 }
      ]
    },
    {
      id: 'r2',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800',
      likes: '85K',
      comments: '940',
      caption: `3 reasons why you need the ${productName} in 2024. Point #2 will surprise you! 👀 #gadgets #review`,
      topComments: [
        { id: 'c3', username: 'daily_hacks', text: 'Point 2 is so true, I used it yesterday.', likes: 120 },
        { id: 'c4', username: 'shopper_pro', text: 'Best purchase of the year honestly.', likes: 85 }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-500" />
          Viral Product Feed
        </h3>
        <Badge variant="outline" className="text-[10px] border-pink-500/30 text-pink-500 font-bold uppercase tracking-tighter">
          Real-time Intel
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {reels.map((reel) => (
          <Card key={reel.id} variant="glass" className="overflow-hidden group flex flex-col h-full border-white/5 transition-all hover:scale-[1.02]">
            <div className="relative aspect-[9/16] overflow-hidden bg-black">
              <img 
                src={reel.thumbnail} 
                alt="Reel thumbnail" 
                className="w-full h-full object-cover transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Play className="h-4 w-4 text-white fill-white shadow-lg" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-bold border border-white/10">
                REEL
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white drop-shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/20 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-white/5">
                    <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                    <span className="text-[10px] font-bold">{reel.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/20 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-white/5">
                    <MessageCircle className="h-3 w-3 fill-white text-white" />
                    <span className="text-[10px] font-bold">{reel.comments}</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-3 bg-secondary/10 flex-1">
              <p className="text-[11px] leading-relaxed line-clamp-2 font-medium text-muted-foreground italic mb-2">
                "{reel.caption}"
              </p>
              {reel.topComments.slice(0, 1).map((comment) => (
                <div key={comment.id} className="text-[10px] border-t border-white/5 pt-2 flex items-start gap-1">
                  <span className="font-bold text-pink-500/80 shrink-0">@{comment.username}</span>
                  <span className="text-muted-foreground/80 truncate">{comment.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
