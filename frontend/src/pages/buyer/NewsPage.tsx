import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../../components/ui/skeleton";

interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

const fetchNews = async () => {
  const res = await axios.get("/api/news");
  return res.data.articles as NewsArticle[];
};

const NewsPage = () => {
  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Latest in Kenyan Agriculture
      </h2>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-500">Failed to load news. Try again later.</p>
      )}

      {!isLoading && articles?.length === 0 && (
        <p className="text-gray-500">No news articles available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles?.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-md overflow-hidden hover:shadow-lg transition duration-200 bg-white"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-3 space-y-1">
              <h3 className="text-lg font-medium">{article.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {article.summary}
              </p>
              <div className="text-xs text-gray-400 flex justify-between pt-2">
                <span>{article.source}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
