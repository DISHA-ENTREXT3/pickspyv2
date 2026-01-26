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
      thumbnail: 'https://images.pexels.com/photos/3183170/pexels-photo-3183170.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: '124K',
      comments: '1.2K',
      caption: `Unboxing the new ${productName}! 🚀 This is a total game changer for my daily routine. #tech #viral #musthave`,
      topComments: [
        { id: 'c1', username: 'trend_finder', text: 'I need this right now! Where can I buy?', likes: 450 },
      ]
    },
    {
      id: 'r2',
      thumbnail: 'https://images.pexels.com/photos/5076527/pexels-photo-5076527.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: '85K',
      comments: '940',
      caption: `3 reasons why you need the ${productName} in 2026. Point #2 will surprise you! 👀 #gadgets #review`,
      topComments: [
        { id: 'c3', username: 'daily_hacks', text: 'Point 2 is so true, I used it yesterday.', likes: 120 },
      ]
    },
    {
      id: 'r3',
      thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: '210K',
      comments: '3.4K',
      caption: `Finally scaling my store with ${productName}. The quality is actually insane! 📈 #dropshipping #win`,
      topComments: [
        { id: 'c5', username: 'ecom_warrior', text: 'This is crushing it for me lately.', likes: 890 },
      ]
    },
    {
      id: 'r4',
      thumbnail: 'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: '92K',
      comments: '1.1K',
      caption: `How to 10x your sales using this one product. Don't miss the trend! 🔥 #marketing #trends`,
      topComments: [
        { id: 'c7', username: 'store_builder', text: 'Added this to my store yesterday!', likes: 210 },
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Instagram className="h-6 w-6 text-pink-500" />
          Viral Product Feed
        </h3>
        <Badge variant="outline" className="text-[10px] border-pink-500/30 text-pink-500 font-bold uppercase tracking-tighter">
          Real-time Intel
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reels.map((reel) => (
          <Card key={reel.id} variant="glass" className="overflow-hidden group flex flex-col h-full border-border/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5">
            <div className="relative aspect-[9/16] overflow-hidden bg-background">
              <img 
                src={reel.thumbnail} 
                alt="Reel thumbnail" 
                className="w-full h-full object-cover transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold border border-white/10 uppercase tracking-widest">
                Reel
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                    <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                    <span className="text-[10px] font-bold">{reel.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
                    <MessageCircle className="h-3 w-3 fill-white text-white" />
                    <span className="text-[10px] font-bold">{reel.comments}</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4 bg-card/60 flex-1 flex flex-col justify-between">
              <p className="text-xs leading-relaxed line-clamp-2 font-medium text-muted-foreground italic mb-3">
                "{reel.caption}"
              </p>
              {reel.topComments.slice(0, 1).map((comment) => (
                <div key={comment.id} className="text-[10px] border-t border-border/50 pt-3 flex items-start gap-2">
                  <span className="font-bold text-pink-500 shrink-0">@{comment.username}</span>
                  <span className="text-muted-foreground font-medium truncate">{comment.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
