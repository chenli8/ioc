export default {
  data() {
    const prefix = `${process.env.VUE_APP_CLS_PREFIX}`;
    return {
      clsPrefix: prefix,
      clsContainer: `${prefix}container`
    };
  }
};
