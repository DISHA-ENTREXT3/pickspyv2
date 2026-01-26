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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-500" />
          Instagram Viral Reels
        </h3>
        <Badge variant="outline" className="text-xs border-pink-500/30 text-pink-500">
          Live Tracking
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reels.map((reel) => (
          <Card key={reel.id} variant="glass" className="overflow-hidden group">
            <div className="relative aspect-[9/16] overflow-hidden">
              <img 
                src={reel.thumbnail} 
                alt="Reel thumbnail" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                    <span className="font-bold">{reel.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-5 w-5 fill-white text-white" />
                    <span className="font-bold">{reel.comments}</span>
                  </div>
                </div>
                <Share2 className="h-5 w-5" />
              </div>
            </div>
            <CardContent className="p-4 bg-secondary/20">
              <p className="text-sm line-clamp-2 mb-4 font-medium italic">"{reel.caption}"</p>
              
              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Top Viral Comments</div>
                {reel.topComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 text-xs border-l-2 border-pink-500/30 pl-3 py-1">
                    <div className="flex-1">
                      <span className="font-bold text-pink-500">@{comment.username}</span>
                      <p className="text-muted-foreground mt-0.5">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground self-start">
                      <Heart className="h-3 w-3" />
                      {comment.likes}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
