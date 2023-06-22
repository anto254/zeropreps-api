const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const uploadBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, summary, content, slug } = req.body;

    if (!title || !summary || !content || !req.file.path || !slug)
      return res.status(400).json({ message: "all fields are required" });

    const blogObject = {
      content: req.body.content,
      summary: req.body.summary,
      title: req.body.title,
	slug: slug,
      img: `https://api.zeropreps.com/${req.file.path}`,


    };

    const blog = await Post.create(blogObject);

    if (blog) {
      res.status(201).json({ message: ` Blog  created` });
    } else {
      res.status(400).json({ message: "Invalid file data received" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = req?.query?.page || 1;
  const perPage = req?.query?.perPage || 20;

  // const {category, state, country} = req.query

  // const filters = {
  //   category: { $regex: category, $options: 'i' },
  //   state: { $regex: state, $options: 'i' },
  //   country: { $regex: country, $options: 'i' },
  //   status: "Available"
  // }

  const [blogs, count] = await Promise.all([
    Post.find()
      .select("title summary img slug")
      .skip((page - 1) * parseInt(perPage))
      .limit(parseInt(perPage))
      .lean()
      .exec(),

    Post.countDocuments(),
  ]);

  if (!blogs?.length) {
    return res.status(404).json({ message: "No blogs found" });
  }
  res.json({ blogs, count });
});

const getBlogById = async (req, res) => {
    const slug = req.params.slug;


  if (!slug) return res.status(400).json({ message: "blog id is required" });

  const blog = await Post.findOne({ slug: slug }).lean().exec();


  if (!blog) {
    return res.status(404).json({ message: "No blog found" });
  }
  res.json(blog);
};

const editBlog = async (req, res) => {
  const { blogId } = req?.params;
  const { title, summary, content, slug } = req.body;

  if (!title || !summary || !content || !blogId || !slug)
    return res.status(400).json({ message: "all fields are required" });

  try {
    const blog = await Post.findById({ _id: blogId }).exec();

    if (!blog) {
      return res.status(400).json({ message: "blog not found" });
    }

    blog.title = title;
    blog.summary = summary;
    blog.content = content;
	    blog.slug = slug;


    if (req.file) {

      blog.img = `https://api.zeropreps.com/${req.file.path}`;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deletePost = async (req, res) => {
  const { postId } = req.params;

  if (!postId) return res.status(400).json({ message: "blog id is required" });


  const post = await Post.findById({ _id: postId }).exec();

  if (!post)
    return res
      .status(400)
      .json({
        message: "Something went wrong, refresh the page and try again",
      });

  await Post.findOneAndDelete({ _id: postId }).exec();

  res.status(200).json({ message: "Blog deleted successfully" });
};


module.exports = {
  uploadBlog,
  getAllBlogs,
  getBlogById,
  editBlog,
  deletePost
};
