var Importer, M, normalizeDate,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

M = require("./mediator");

normalizeDate = function(dateString) {
  var date;
  date = new Date();
  if (dateString) {
    date = new Date(Date.parse(dateString));
  }
  return (date.getFullYear()) + "-" + (date.getMonth() < 9 ? '0' + String(date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
};

module.exports = Importer = (function() {
  Importer.prototype.xml = null;

  Importer.prototype.channel = null;

  function Importer() {
    this.stringify = bind(this.stringify, this);
    this.addAttachment = bind(this.addAttachment, this);
    this.addPost = bind(this.addPost, this);
    this.addCategory = bind(this.addCategory, this);
    this.xml = M.builder.create("rss").att("xmlns:excerpt", "http://wordpress.org/export/1.2/excerpt/").att("xmlns:content", "http://purl.org/rss/1.0/modules/content/").att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/").att("xmlns:dc", "http://purl.org/dc/elements/1.1/").att("xmlns:wp", "http://wordpress.org/export/1.2/").att("version", "2.0");
    this.channel = this.xml.ele("channel");
    this.channel.ele("wp:wxr_version", {}, 1.2);
  }

  Importer.prototype.addCategory = function(category) {
    var cat, catName, catNameCDATA, catNiceName, termId;
    cat = this.channel.ele("wp:category");
    termId = cat.ele("wp:term_id", {}, category.id ? category.id : Math.floor(Math.random() * 100000));
    catNiceName = cat.ele("wp:category_nicename", {}, category.slug);
    catName = cat.ele("wp:cat_name");
    return catNameCDATA = catName.dat(category.title);
  };

  Importer.prototype.addPost = function(post) {
    var postId, metaData, metaDataKey, metaDataValue, metaDataValueCDATA, cat, catTag, catCDATA, catTagCDATA, category, tag, contentEncoded, contentEncodedCDATA, creator, date, description, excerptEncoded, excerptEncodedCDATA, i, item, len, name, parent, ref, refTag, ref1, ref1Tag, results, resultsTags, status, title, type;
    item = this.channel.ele("item");
    title = item.ele("title", {}, post.title ? post.title : "");
    postId = item.ele("wp:post_id", {}, post.id ? post.id : "")
    name = item.ele("wp:post_name", {}, post.name ? post.name : "");
    description = item.ele("description", post.description ? post.description : "");
    date = item.ele("wp:post_date", {}, normalizeDate(post.date));
    status = item.ele("wp:status", {}, post.status ? post.status : "publish");
    parent = item.ele("wp:post_parent", {}, 0);
    type = item.ele("wp:post_type", {}, "post");
    creator = item.ele("dc:creator", {}, post.author ? post.author : "admin");
    contentEncoded = item.ele("content:encoded");
    contentEncodedCDATA = contentEncoded.dat(post.contentEncoded ? post.contentEncoded : "");
    excerptEncoded = item.ele("excerpt:encoded");
    excerptEncodedCDATA = excerptEncoded.dat(post.excerptEncoded ? post.excerptEncoded : "");
    if (((ref = post.categories) != null ? ref.length : void 0) > 0) {
      ref1 = post.categories;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        category = ref1[i];
        if (category.slug && category.title) {
          cat = item.ele("category", {
            domain: "category",
            nicename: category.slug
          });
          results.push(catCDATA = cat.dat(category.title));
        } else {
          results.push(void 0);
        }
      }
    }

    if (((refTag = post.tags) != null ? refTag.length : void 0) > 0) {
      ref1Tag = post.tags;
      resultsTags = [];
      for (i = 0, len = ref1Tag.length; i < len; i++) {
        tag = ref1Tag[i];
        if (tag.slug && tag.title) {
          catTag = item.ele("category", {
            domain: "post_tag",
            nicename: tag.slug
          });
          resultsTags.push(catTagCDATA = catTag.dat(tag.title));
        } else {
          resultsTags.push(void 0);
        }
      }
    }

    if (post.featuredImageId) {
        metaData = item.ele("wp:postmeta");
        metaDataKey = metaData.ele("wp:meta_key", {}, "_thumbnail_id");
        metaDataValue = metaData.ele("wp:meta_value", {}, post.featuredImageId);
    }

    var metaDataDate = item.ele("wp:postmeta");
    var metaDataKeyDate = metaDataDate.ele("wp:meta_key", {}, "medium_publish_date");
    var metaDataValueDate = metaDataDate.ele("wp:meta_value", {}, normalizeDate(post.date));
  };

  Importer.prototype.addAttachment = function(options) {
    var postId, creator, date, description, excerptEncoded, excerptEncodedCDATA, item, parent, status, title, type;
    if (options.attachmentURL) {
      item = this.channel.ele("item");
      date = item.ele("wp:post_date", {}, normalizeDate(options.date));
      title = item.ele("title", {}, options.title ? options.title : "Default title for attachment");
      postId = item.ele("wp:post_id", {}, options.id ? options.id : 0);
      creator = item.ele("dc:creator", {}, options.author ? options.author : "admin");
      description = item.ele("description", options.description ? options.description : "");
      excerptEncoded = item.ele("excerpt:encoded");
      excerptEncodedCDATA = excerptEncoded.dat(options.excerptEncoded ? options.excerptEncoded : "");
      status = item.ele("wp:status", {}, options.status ? options.status : "inherit");
      parent = item.ele("wp:post_parent", {}, options.parent ? options.parent : 0);
      type = item.ele("wp:post_type", {}, "attachment");
      return type = item.ele("wp:attachment_url", {}, options.attachmentURL ? options.attachmentURL : "");
    }
  };

  Importer.prototype.stringify = function() {
    return this.xml.end({
      pretty: true,
      indent: "    ",
      newline: "\n"
    });
  };

  return Importer;

})();
