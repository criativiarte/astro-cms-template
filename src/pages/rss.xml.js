import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../config/consts';
import { getPostData, getPublishedPosts } from '../utils/blog';

export async function GET(context) {
	const posts = await getPublishedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const postData = getPostData(post);

			return {
				title: postData.title,
				description: postData.description,
				link: `/blog/${postData.slug}/`,
				pubDate: postData.pubDate,
			};
		}),
	});
}
