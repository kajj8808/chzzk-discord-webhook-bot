export interface LiveContent {
  code: number;
  message: string | null;
  content: {
    liveId: number;
    liveTitle: string;
    status: string;
    liveImageUrl: string;
    defaultThumbnailImageUrl: string | null;
    concurrentUserCount: number;
    accumulateCount: number;
    openDate: string;
    closeDate: string;
    adult: boolean;
    clipActive: boolean;
    tags: string[];
    chatChannelId: string;
    categoryType: string;
    liveCategory: string;
    liveCategoryValue: string;
    chatActive: boolean;
    chatAvailableGroup: string;
    paidPromotion: boolean;
    chatAvailableCondition: string;
    minFollowerMinute: number;
    allowSubscriberInFollowerMode: boolean;
    livePlaybackJson: string;
    p2pQuality: [];
    channel: {
      channelId: string;
      channelName: string;
      channelImageUrl: string;
      verifiedMark: boolean;
    };
    livePollingStatusJson: string;
    userAdultStatus: string | null;
    blindType: string | null;
    chatDonationRankingExposure: boolean;
    adParameter: {
      tag: string;
    };
    dropsCampaignNo: string | null;
  };
}
