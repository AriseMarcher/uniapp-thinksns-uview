<template>
	<view class="content">
		<view class="header-box">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2500" :duration="500">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<navigator open-type="navigate" :url="'/pages/webview/webview?url=' + encodeURI(item.data.link)">
						<image class="banner-swiper-img" :src="item.data.image"></image>
					</navigator>
				</swiper-item>
			</swiper>

			<!-- 遮罩使用弧形框 -->
			<image class="crile" src="@/static/crile.png" mode="aspectFill" />
			<!-- 两个选项按钮 -->
			<view class="card-header">
				<view class="card-one card-left" @tap="gotoFeeds('/pages/feeds/feeds')">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">精彩动态</view>
					</view>
				</view>
				<view class="card-one card-right" @tap="gotoFeeds('/pages/me/me')">
					<image class="img" src="@/static/ran.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">个人中心</view>
					</view>
				</view>
			</view>
			
			<!-- Tab 选项卡 -->
			<view class="tabs-box">
				<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : '' " @tap="swiperChange(0)">推荐</view>
				<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : '' " @tap="swiperChange(1)">资讯</view>
			</view>
		</view>
		
		<swiper
			class="swiper-box"
			:style="'height:' + swiperSliderHeight "
			:current="currentSwiperIndex"
			@animationfinish="swiperSlider"
		>
			<swiper-item class="swiper-item sns-now">
				<view class="feeds-box">
					<sns-waterfall v-model="feedsList" ref="waterFall">
						<template v-slot:left="{leftList}">
							<view class="feed-one" v-for="(item, index) in leftList" :key="index">
								<navigator open-type="navigate" :url=" '/subpages/feedinfo/feedinfo?id=' + item.id">
									<image class="feed-img" :src="item.cover" mode="widthFix" :lazy-load="true" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
									<view class="feed-info">
										<view class="iview">
											<image class="avatar" :src=" item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
										</view>
										<view class="iview">
											<view class="ilike" @tap.stop="clickLove(item)">
												<image v-if="item.has_like" src="@/static/lover.png" class="micon" />
												<image v-else src="@/static/love.png" class="micon" />
												<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
						<template v-slot:right="{rightList}">
							<view class="feed-one" v-for="(item, index) in rightList" :key="index">
								<navigator open-type="navigate" :url=" '/subpages/feedinfo/feedinfo?id=' + item.id">
									<image class="feed-img" :src="item.cover" mode="widthFix" :lazy-load="true" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
									<view class="feed-info">
										<view class="iview">
											<image class="avatar" :src=" item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
										</view>
										<view class="iview">
											<view class="ilike" @tap.stop="clickLove(item)">
												<image v-if="item.has_like" src="@/static/lover.png" class="micon" />
												<image v-else src="@/static/love.png" class="micon" />
												<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
					</sns-waterfall>
					
				</view>
			</swiper-item>
			<swiper-item class="swiper-item sns-news">
				<view v-for="(item, index) in newsList" :key="index">
					<navigator class="one-new" open-type="navigate" :url=" '/subpages/newinfo/newinfo?id=' + item.id">
						<view class="left">
							<view class="title u-line-2">{{item.title}}</view>
							<view class="uinfo">
								<view class="iview">
									<view class="utime">
										<text class="name">{{ item.author }}</text>
									</view>
								</view>
								<text class="uptime">{{ item.created_at | timeFormate }}发布</text>
							</view>
						</view>
						<view class="right">
							<image class="pic" mode="aspectFill" :src="item.cover" />
						</view>
					</navigator>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import snsWaterfall from '@/components/waterfall-sns/index.vue'
	export default {
		data() {
			return {
				swiperList: [], // 轮播图广告列表信息
				currentSwiperIndex: 0, // 当前 推荐 咨询 滑动位置
				feedsList: [], // 动态列表数据
				newsList: [], // 资讯列表数据
				swiperSliderHeight: '1000px', // 滑动基础高度
				swiperSliderFeedsHeight: '0px',
				swiperSliderNewsHeight: '0px'
			}
		},
		components: {
			snsWaterfall
		},
		filters: {
			timeFormate(timeDate) {
				// let Time = new Date(timeDate);
				// let timestemp = Time.getTime();
				// let t = timeFrom(timestemp, "yyyy年mm月dd日");
				// return t;
				return 'xxx'
			}
		},
		async onLoad() {
			this.loadAdvertising()
			this.loadFeeds()
			this.loadNews()
		},
		methods: {
			async loadAdvertising () {
				let data = await this.$u.api.getAdvert()
				if (data.statusCode === 200) {
					this.swiperList = data.data
				}
			},
			gotoFeeds (url) {
				uni.switchTab({
					url
				})
			},
			// 推荐、资讯 滑动切换方法
			swiperSlider (event) {
				let index = event.detail.current
				this.swiperChange(index)
			},
			// 推荐、资讯点击切换方法
			swiperChange (index) {
				if (index === 0) {
					this.swiperSliderHeight = this.swiperSliderFeedsHeight
				} else {
					this.swiperSliderHeight = this.swiperSliderNewsHeight
				}
				this.currentSwiperIndex = index
			},
			// 获取动态信息
			async loadFeeds () {
				let feeds = await this.$u.api.getFeeds()
				console.log(feeds.data.feeds)
				this.feedsList = feeds.data.feeds.map(item => {
					let curCover = ''
					if (item.images.length) {
						curCover = this.BaseFileUrl + item.images[0].file
					} else {
						curCover = ''
					}
					return {
						cover: curCover,
						avatar: !!item.user.avatar ? item.user.avatar : '/static/nopic.png',
						name: item.user.name || '',
						...item
					}
				})
				uni.$on('swiperHeightChange', height => {
					console.log('触发了' + height)
					this.swiperSliderFeedsHeight = height
					this.swiperSliderHeight = height
				})
			},
			// 获取资讯信息
			async loadNews () {
				let news = await this.$u.api.getNews()
				this.newsList = news.data.map(item => {
					return {
						cover: this.BaseFileUrl + item.image.id,
						...item
					}
				})
				this.swiperSliderNewsHeight = (this.newsList.length * 95 + 100) + 'px'
				console.log(this.newsList)
			},
		}
	}
</script>

<style lang="scss">
	#sns {
		background-color: #f1f1f1;
	}

	// 推荐、咨询 按钮样式
	.tabs-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 750upx;

		.one-nav {
			width: 120upx;
			color: #9B9B9B;
			font-size: 36upx;
			text-align: center;
			font-weight: blod;

			&.nav-actived {
				color: #0050FF;
			}
		}
	}

	.header-box {
		position: relative;
		left: 0;
		height: 500upx;
		background-color: #f1f1f1;
		z-index: 1;

		// 广告位轮播器相关样式
		.swiper {
			width: 750upx;
			height: 400upx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			z-index: 1;

			.banner-swiper-img {
				width: 750upx;
				height: 400upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
			}
		}

		.crile {
			width: 750upx;
			height: 50upx;
			position: absolute;
			left: 0;
			top: 355upx;
			z-index: 9;
		}

		// 新鲜事 活动墙 按钮样式
		.card-header {
			position: absolute;
			left: 0;
			top: 320upx;
			height: 160upx;
			z-index: 99;
			width: 710upx;
			margin-left: 20upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;

			.card-one {
				width: 328upx;
				height: 96upx;
				border-radius: 49upx;
				background-color: #fff;
				margin: 0 10upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;

				.img {
					width: 44upx;
					height: 44upx;
					margin-left: 50upx;
				}

				.iright {
					margin-left: 30upx;
					text-align: left;
					color: #888;

					.title {
						font-size: 30upx;
						color: #001432;
					}

					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						font-size: 20upx;
						margin-top: -5upx;
					}
				}
			}
		}

		// 推荐、咨询 按钮样式
		.tabs-box {
			width: 750upx;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 480upx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			.one-nav {
				height: 80upx;
				width: 110upx;
				color: #9B9B9B;
				font-size: 36upx;
				text-align: center;
				font-weight: blod;

				&.nav-actived {
					color: #0050FF;
				}
			}
		}
	}

	// 此刻 栏目样式\
	.swiper-box {
		background-color: #f1f1f1;
		padding: 60upx 0 40upx;
	}

	.sns-now {

		// 动态相关瀑布流样式
		.feeds-box {
			width: 735upx;
			margin-left: 13upx;
			padding-bottom: 20upx;

			.feed-one {
				width: 358upx;
				margin-bottom: 12upx;
				background-color: #FFF;
				border-radius: 20upx;

				position: relative;

				.feed-img {
					width: 358upx;
					height: 300upx;
					border-radius: 10upx;
				}

				.feed-title {
					width: 350upx;
					margin-top: 15upx;
					margin-left: 10upx;
					font-size: 28upx;
					line-height: 40upx;
					color: #001432;
					text-align: left;
				}

				.feed-info {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 10upx;
					font-size: 20upx;
					color: #666;
					padding: 0 10upx 16upx;

					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;

						.ilike {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							align-content: center;
							height: 60upx;
							padding: 0 10upx;
							background-color: #FFFFFF;
						}
					}

					.avatar {
						margin-right: 10upx;
						height: 40upx;
						width: 40upx;
						border-radius: 50%;
						border: 1upx solid #eee;
					}

					.name {
						max-width: 120upx;
						color: #757474;
					}

					.micon {
						width: 32upx;
						height: 28upx;
					}

					.love-count {
						padding-left: 10upx;
						color: #757474;
					}
				}
			}
		}
	}

	// 轮播页面 资讯
	.sns-news {
		background-color: #fff;
		width: 750upx;

		.one-new {
			width: 700upx;
			height: 74px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: flex-start;
			align-content: center;
			padding-bottom: 10px;
			padding-top: 10px;
			padding-left: 25upx;
			padding-right: 25upx;
			border-bottom: 1px solid #f1f1f1;

			.left {
				width: 490upx;
				height: 140upx;
				text-align: left;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;

				.title {
					font-size: 30upx;
					line-height: 42upx;
					color: #001432;
					margin-top: 21upx;
				}

				.uinfo {
					width: 490upx;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 6upx;
					font-size: 20upx;
					color: #999;

					.utime {
						font-size: 24upx;

						.name {
							max-width: 120upx;
							color: #777;
						}
					}
				}
			}

			.right {
				width: 120upx;

				.pic {
					width: 120upx;
					height: 120upx;
					margin-top: 20upx;
					border-radius: 6upx;
				}
			}
		}
	}
</style>
