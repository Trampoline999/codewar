import { db } from "../libs/db.js";

const createPlaylist = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  try {
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId: userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "playlist created Successfully",
      playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error fetching create Playlist",
    });
  }
};

const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "successfully fetched All List Details",
      playlists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error fetching getAllListDetails",
    });
  }
};

const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
        userId: req.user.id,
      },

      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "successfully fetched All List Details",
      playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error fetching get Playlist Details",
    });
  }
};

const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing problemIds" });
  }

  /*  problemIds.map((problemId) => {
    console.log(problemId);
    console.log(playlistId);
  }); */
  try {
    const problemInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        problemId,
        playlistId,
      })),
    });

    res.status(200).json({
      success: true,
      message: "successfully added problems in playlists",
      problemInPlaylist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error fetching addProblemToPlaylist",
    });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deletePlaylist = await db.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });
    res.status(200).json({
      success: true,
      message: "successfully deleted playlist",
      deletePlaylist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to delete Playlist",
    });
  }
};

const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }
    // Only delete given problemIds not all

    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to  remove Problem From Playlist",
    });
  }
};

export {
  getAllListDetails,
  getPlaylistDetails,
  createPlaylist,
  addProblemToPlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
};
