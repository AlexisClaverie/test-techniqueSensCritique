import Image from "next/image";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

export const AnimeList = () => {
  const [count, setCount] = useState(10);
  const GET_ANIMES = gql`
    query GetAnimes {
      Page(page: 1, perPage: ${count}) { 
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME) {
          id
          title {
            english
            romaji
          }
          episodes
        }
      }
    }
  `;
  const [animes, setAnimes] = useState([]);
  const { loading, error, data } = useQuery(GET_ANIMES);

  useEffect(() => {
    if (data) {
      setAnimes(data.Page.media);
    }
  }, [data]);

  const handleSaveAnimes = async (anime, e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/anime", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(anime),
    });
    return response.json();
  };

  return (
    <div className="last-released">
      <h3>Dernieres sorties</h3>
      <div className="anime-card">
        {animes &&
          animes.map((anime, index) => {
            return (
              <div className="anime" key={index}>
                <Image
                  src={`/animes/anime_default.jpg`}
                  alt={"logo"}
                  width={90}
                  height={120}
                  className="anime-image"
                />
                <p className="anime-title">
                  {anime.title.english
                    ? anime.title.english
                    : anime.title.romaji}
                </p>
                <p className="anime-score">
                  Note : {anime.score ? anime.score : "N/A"}
                </p>
                <button onClick={(e) => handleSaveAnimes(anime, e)}>
                  save anime
                </button>
              </div>
            );
          })}
      </div>
      {count < 50 ? (
        <button onClick={() => setCount(count + 10)} className="show-more">
          Voir plus
        </button>
      ) : null}

      <style jsx>{`
        .last-released {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
        .anime {
          display: flex;
          align-items: center;
          margin: 5px 0 5px 0;
          justify-content: space-between;
          border-radius: 5px;
          border: solid 1px #997af0;
          background-color: #f7f1f4;
          padding: 5px;
        }
        .anime-title,
        .anime-score {
          margin: 0 10px 0 10px;
          font-weight: 600;
        }
        button {
          background-color: #997af0;
          color: white;
          padding: 1rem 2rem;
          border: none;
          font-weight: bold;
          cursor: pointer;
          border-radius: 0.4rem;
          font-size: 1rem;
          text-transform: uppercase;
          transition: 0.5s ease-in-out;
        }
        .anime-image {
          padding: 6px;
        }
      `}</style>
    </div>
  );
};
